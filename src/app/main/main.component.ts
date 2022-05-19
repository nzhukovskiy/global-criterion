import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';


import * as math from "mathjs";
import * as Solver from "javascript-lp-solver";
//import * as GLPK from "glpk.js";
//import {loadModule, Model, Variable} from 'glpk-ts';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
//import { PlotlyViaWindowModule } from 'angular-plotly.js';
import {Datum} from "plotly.js";
import {Plotly} from "angular-plotly.js/lib/plotly.interface";
import Data = Plotly.Data;
import {Variable} from "../variable";
import {ThemePalette} from "@angular/material/core";

//import functionPlot from "function-plot";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {


  @ViewChild('plot') plot!: ElementRef;
  formArray =new FormArray([]);
  constraintsFormArray =new FormArray([]);

  constructor(private fb:FormBuilder) {
  }

  public graph = {
    data: [],
    layout: {width: 900, height: 755, title: 'График',
      xaxis: {
      },
      yaxis: {
        scaleanchor: "x"
      }
    }
  };
  primaryColor: ThemePalette = 'primary';
  data : Data[] = [];
  criteriaCountValues : number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  variableCountValues : number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  constraintCountValues : number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  criteriaCount: number = 2;
  variablesCount: number = 2;
  constraintsCount: number = 2;
  globalCriterion: number = 0;
  criterionGoal : string[] = [];
  criterionThreshold = new FormArray([]);
  constraintType : string[] = [];
  constraintValues = new FormArray([]);
  optimizationGoal: string = "max";
  isVariableBounded: Variable[] = [];
  results: any;
  ngOnInit(): void {


    for (let i = 0; i < this.criteriaCount; i++) {
      this.formArray.push(new FormArray([]))
      for (let j = 0; j < this.variablesCount; j++) {
        (this.formArray.at(i) as FormArray).push(new FormControl(0))
      }
    }
    for (let i = 0; i < this.constraintsCount; i++) {
      this.constraintsFormArray.push(new FormArray([]))
      for (let j = 0; j < this.variablesCount; j++) {
        (this.constraintsFormArray.at(i) as FormArray).push(new FormControl(0))
      }
    }
    for (let i = 0; i < this.criteriaCount; i++) {
      this.criterionGoal.push("max");
      this.criterionThreshold.push(new FormControl(0));
    }
    for (let i = 0; i < this.constraintsCount; i++) {
      this.constraintType.push("max");
      this.constraintValues.push(new FormControl(0));
    }
    for (let i = 0; i < this.variablesCount; i++) {
      this.isVariableBounded.push(new Variable(true));
    }
  }
  getFormArray(control: AbstractControl) {
    return control as FormArray;
  }
  getFormControl(control: AbstractControl) {
    return control as FormControl;
  }
  getFormGroup(control: AbstractControl) {
    return control as FormGroup;
  }
  changeCriteriaCount(newValue: number) {
    this.criteriaCount = newValue;
    this.resizeMatrix();
  }
  changeVariablesCount(newValue: number) {
    this.variablesCount = newValue;
    this.resizeMatrix();
    this.resizeConstraintsMatrix();
  }
  changeConstraintsCount(newValue: number) {
    this.constraintsCount = newValue;
    this.resizeConstraintsMatrix();
  }


  resizeFormMatrix(formArray: FormArray, newRows: number, newCols: number) {
    let oldValues = formArray.value;
    formArray.clear();
    for (let i = 0; i < newRows; i++) {
      formArray.push(new FormArray([]))
      for (let j = 0; j < newCols; j++) {
        if (i < oldValues.length && j < oldValues[i].length) {
          (formArray.at(i) as FormArray).push(new FormControl(oldValues[i][j]))
        }
        else {
          (formArray.at(i) as FormArray).push(new FormControl(0))
        }
      }
    }
  }

  resizeMatrix() {
    this.resizeFormMatrix(this.formArray, this.criteriaCount, this.variablesCount);
    let oldCriterionGoal = this.criterionGoal;
    this.criterionGoal = [];
    for (let i = 0; i < this.criteriaCount; i++) {
      if (i < oldCriterionGoal.length) {
        this.criterionGoal.push(oldCriterionGoal[i]);
      }
      else {
        this.criterionGoal.push("max");
      }
    }
    let oldThresholdValues = this.criterionThreshold.value;
    this.criterionThreshold.clear();
    for (let i = 0; i < this.criteriaCount; i++) {
      if (i < oldThresholdValues.length) {
        this.criterionThreshold.push(new FormControl(oldThresholdValues[i]));
      }
      else {
        this.criterionThreshold.push(new FormControl(0));
      }
    }
    let oldBounds = this.isVariableBounded;
    this.isVariableBounded = [];
    for (let i = 0; i < this.variablesCount; i++) {
      if (i < oldBounds.length) {
        this.isVariableBounded.push(new Variable(oldBounds[i].restricted));
      }
      else {
        this.isVariableBounded.push(new Variable(true));
      }
    }
  }
  resizeConstraintsMatrix() {
    this.resizeFormMatrix(this.constraintsFormArray, this.constraintsCount, this.variablesCount);
    let oldConstraintsType = this.constraintType;
    this.constraintType = [];
    for (let i = 0; i < this.constraintsCount; i++) {
      if (i < oldConstraintsType.length) {
        this.constraintType.push(oldConstraintsType[i]);
      }
      else {
        this.constraintType.push("max");
      }

    }
    let oldConstraintValues = this.constraintValues.value;
    this.constraintValues.clear();
    for (let i = 0; i < this.constraintsCount; i++) {
      if (i < oldConstraintValues.length) {
        this.constraintValues.push(new FormControl(oldConstraintValues[i]));
      }
      else {
        this.constraintValues.push(new FormControl(0));
      }
    }
  }
  generateRange(start: number, end: number, step: number) {
    let resArray : number[] = [];
    let generateValues = math.range(start, end, step);
    generateValues.forEach( el => {
      resArray.push(el);
    })
    return resArray;
  }
  evaluateExpression(expression: string, isYFunc: boolean, centerPoint: number) {
    let expr = math.compile(expression);
    let xValues;
    let yValues;
    if (isYFunc) {
      xValues = this.generateRange(centerPoint-50, centerPoint+50, 0.01);
      yValues = xValues.map(function (x) {
        return expr.evaluate({x: x})
      })
    }
    else {
      yValues = this.generateRange(centerPoint-50, centerPoint+50, 0.01);
      xValues = yValues.map(function (x) {
        return expr.evaluate({x: x})
      })

    }
    let trace : Data = {
      x: xValues,
      y: yValues,
      type: 'scatter',
      name: expression
    }
    return trace;
  }
  solveTask() {
    let constraintModel : Record<string, any>= {}

    //Criteria matrix
    for (let i = 0; i < this.criteriaCount; i++) {
      if (i !== this.globalCriterion) {
        let constraintTypeModel : Record<string, any>= {}
        constraintTypeModel[this.criterionGoal[i]] = this.criterionThreshold.at(i).value;
        constraintModel["u"+(i+1).toString()] = constraintTypeModel;
      }
    }
    let variablesModel: Record<string, any>= {}
    let unrestrictedModel: Record<string, any>= {}
    for (let j = 0; j < this.variablesCount; j++) {
      let variableCriterionModel : Record<string, any>= {}
      for (let i = 0; i < this.criteriaCount; i++) {
        variableCriterionModel["u"+(i+1).toString()] = this.formArray.value[i][j];
      }
      for (let i = 0; i < this.constraintsCount; i++) {
        variableCriterionModel["u"+(this.criteriaCount +i+1).toString()] = this.constraintsFormArray.value[i][j];
      }
      variablesModel["x"+(j+1).toString()] = variableCriterionModel;
      if (!this.isVariableBounded[j].restricted) {
        unrestrictedModel["x"+(j+1).toString()] = 1;
      }
    }
    //Constraints matrix
    for (let i = 0; i < this.constraintsCount; i++) {
        let constraintTypeModel : Record<string, any>= {}
        constraintTypeModel[this.constraintType[i]] = this.constraintValues.at(i).value;
        console.log(constraintTypeModel);
        constraintModel["u"+(this.criteriaCount + i+1).toString()] = constraintTypeModel;
        console.log(constraintModel);
    }

    var solver = Solver,
      results,
      model = {
        "optimize": "u" + (this.globalCriterion+1).toString(),
        "opType": this.optimizationGoal,
        "constraints": constraintModel,
        "variables": variablesModel,
        "unrestricted": unrestrictedModel
      };

    results = solver.Solve(model);
    this.results = results;
    this.data = [];
    if (this.results.feasible !== false && this.results.bounded !== false && this.variablesCount == 2) {
      for (let i = 0; i < this.criteriaCount; i++) {
        if (i === this.globalCriterion) {
          let gradientTrace = this.evaluateExpression(`(${this.formArray.value[i][1]}*x)/${this.formArray.value[i][0]}`, true, this.getResults()[0]);
          gradientTrace.name = 'Градиент целевой функции';
          gradientTrace.line = {
            dash: 'solid',
            width: 4
          }
          this.data.push(gradientTrace);
          let normalToGradientTrace = this.evaluateExpression(`(-1/(${this.formArray.value[i][1]}/${this.formArray.value[i][0]}))*(x-${this.getResults()[0]})+${this.getResults()[1]}`, true, this.getResults()[0]);
          normalToGradientTrace.name = 'Перпендикуляр к градиенту';
          normalToGradientTrace.line = {
            dash: 'dot',
            width: 2
          }
          this.data.push(normalToGradientTrace);
        }
        else {
          let trace : Data;
          if (this.formArray.value[i][0] === 0) {
            trace = this.evaluateExpression(`(${this.criterionThreshold.at(i).value})/${this.formArray.value[i][1]}`, true, this.getResults()[0]);
          }
          else if (this.formArray.value[i][1] === 0) {
            trace = this.evaluateExpression(`(${this.criterionThreshold.at(i).value})/${this.formArray.value[i][0]}`, false, this.getResults()[1]);
          }
          else {
            trace = this.evaluateExpression(`(${this.criterionThreshold.at(i).value}-${this.formArray.value[i][0]}*x)/${this.formArray.value[i][1]}`, true, this.getResults()[0]);
          }
          this.data.push(trace);
        }

      }
      for (let i = 0; i < this.constraintsCount; i++) {
        let trace : Data;
        if (this.constraintsFormArray.value[i][0] === 0) {
          trace = this.evaluateExpression(`(${this.constraintValues.at(i).value})/${this.constraintsFormArray.value[i][1]}`, true, this.getResults()[0]);
        }
        else if (this.constraintsFormArray.value[i][1] === 0) {
          trace = this.evaluateExpression(`(${this.constraintValues.at(i).value})/${this.constraintsFormArray.value[i][0]}`, false, this.getResults()[1]);
        }
        else {
          trace = this.evaluateExpression(`(${this.constraintValues.at(i).value}-${this.constraintsFormArray.value[i][0]}*x)/${this.constraintsFormArray.value[i][1]}`, true, this.getResults()[0]);
        }

        this.data.push(trace);
      }
      const optimalPointTrace : Data= {
        x: [this.getResults()[0]],
        y: [this.getResults()[1]],
        type: 'scatter',
        name: 'Оптимальная точка'
      }
      this.data.push(optimalPointTrace);

    }
  }
  getResults() {
    let results = [];
    for (let i = 0; i < this.variablesCount; i++) {
      if (this.results["x"+(i+1).toString()] !== undefined) {
        results.push(this.results["x"+(i+1).toString()])
      }
      else {
        results.push(0);
      }
    }
    return results;
  }
}


