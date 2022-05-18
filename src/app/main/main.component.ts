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
    layout: {width: 900, height: 500, title: 'График'}
  };
  data : Data[] = [];
  criteriaCountValues : number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10];
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

    const expression = "4 * sin(x) + 5 * cos(x/2)";
    const expr = math.compile(expression)

    // evaluate the expression repeatedly for different values of x
    /*const xValues : Datum[] = [-10, -9, -8, -7, -6, -5, -4, -3, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const variable : Datum[] = [1, 2, 3]
    const yValues = xValues.map(function (x) {
      return expr.evaluate({x: x})
    })

    // render the plot using plotly
    const trace1 : Data= {
      x: xValues,
      y: yValues,
      type: 'scatter'
    }
    const data : Data[] = [trace1]
    this.data = data;*/
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
    console.log(this.formArray);
    var solver = Solver,
      results,
      model = {
        "optimize": "u1",
        "opType": "max",
        "constraints": {
          "u2": {"max": 30},
          "u3": {"min": 2},
          "u4": {"max": 50},
          "u5": {"max": 54}
        },
        "variables": {
          "x1": {
            "u1": 8,
            "u2": 10,
            "u3": 1,
            "u4": 10,
            "u5": 6
          },
          "x2": {
            "u1": 6,
            "u2": 5,
            "u3": 0,
            "u4": 5,
            "u5": 9
          }
        },
      };

    results = solver.Solve(model);
    console.log(results);
  }
  getFormArray(control: AbstractControl) { return control as FormArray; }
  getFormControl(control: AbstractControl) { return control as FormControl; }
  getFormGroup(control: AbstractControl) { return control as FormGroup; }
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


  resizeMatrix() {
    let oldValues = this.formArray.value;
    this.formArray.clear();
    for (let i = 0; i < this.criteriaCount; i++) {
      this.formArray.push(new FormArray([]))
      for (let j = 0; j < this.variablesCount; j++) {
        if (i < oldValues.length && j < oldValues[i].length) {
          (this.formArray.at(i) as FormArray).push(new FormControl(oldValues[i][j]))
        }
        else {
          (this.formArray.at(i) as FormArray).push(new FormControl(0))
        }
      }
    }
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
    let oldValues = this.constraintsFormArray.value;
    this.constraintsFormArray.clear();
    for (let i = 0; i < this.constraintsCount; i++) {
      this.constraintsFormArray.push(new FormArray([]))
      for (let j = 0; j < this.variablesCount; j++) {
        if (i < oldValues.length && j < oldValues[i].length) {
          (this.constraintsFormArray.at(i) as FormArray).push(new FormControl(oldValues[i][j]))
        }
        else {
          (this.constraintsFormArray.at(i) as FormArray).push(new FormControl(0))
        }
      }
    }
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
    console.log(this.constraintValues);
  }
  generateRange(start: number, end: number, step: number) {
    let resArray : number[] = [];
    let generateValues = math.range(start, end, step);
    generateValues.forEach( el => {
      resArray.push(el);
    })
    return resArray;
  }
  solveTask() {
    console.log(this.isVariableBounded);
    //console.log(this.constraintType);
    //console.log(this.constraintValues);
    let constraintModel : Record<string, any>= {}

    //Criteria matrix
    for (let i = 0; i < this.criteriaCount; i++) {
      if (i !== this.globalCriterion) {
        let constraintTypeModel : Record<string, any>= {}
        constraintTypeModel[this.criterionGoal[i]] = this.criterionThreshold.at(i).value;
        console.log(constraintTypeModel);
        constraintModel["u"+(i+1).toString()] = constraintTypeModel;
        console.log(constraintModel);
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
    //let variablesModel: Record<string, any>= {}
    /*if (this.constraintsCount != 0) {
      for (let j = 0; j < this.variablesCount; j++) {
        let variableCriterionModel : Record<string, any>= {}
        for (let i = 0; i < this.constraintsCount; i++) {
          variableCriterionModel["u"+ (this.criteriaCount +i+1).toString()] = this.formArray.value[i][j];
        }
        variablesModel["x"+(j+1).toString()] = variableCriterionModel;
      }
    }*/

    console.log(variablesModel);
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
    console.log(results);
    this.results = results;
    console.log(this.formArray.value);
    this.data = [];
    if (this.results.feasible !== undefined && this.variablesCount == 2) {
      for (let i = 0; i < this.criteriaCount; i++) {
        if (i === this.globalCriterion) {

        }
        else {
          let xValues : Datum[] = [];
          let yValues;
          let expression;
          if (this.formArray.value[i][0] === 0) {
            expression = `(${this.criterionThreshold.at(i).value})/${this.formArray.value[i][1]}`;
            const expr = math.compile(expression)

            xValues = this.generateRange(-10, 10, 0.01);
            yValues = xValues.map(function (x) {
              return expr.evaluate({x: x})
            })
          }
          else if (this.formArray.value[i][1] === 0) {
            expression = `(${this.criterionThreshold.at(i).value})/${this.formArray.value[i][0]}`;
            const expr = math.compile(expression)

            yValues = this.generateRange(-10, 10, 0.01);
            xValues = yValues.map(function (x) {
              return expr.evaluate({x: x})
            })
          }
          else {
            expression = `(${this.criterionThreshold.at(i).value}-${this.formArray.value[i][0]}*x)/${this.formArray.value[i][1]}`;
            const expr = math.compile(expression)

            xValues = this.generateRange(-10, 10, 0.01);
            yValues = xValues.map(function (x) {
              return expr.evaluate({x: x})
            })
          }
          const trace : Data= {
            x: xValues,
            y: yValues,
            type: 'scatter',
            name: expression
          }
          console.log(trace);
          this.data.push(trace);
        }

      }
      for (let i = 0; i < this.constraintsCount; i++) {
        let xValues : Datum[] = [];
        let yValues;
        let expression;
        if (this.constraintsFormArray.value[i][0] === 0) {
          expression = `(${this.constraintValues.at(i).value})/${this.constraintsFormArray.value[i][1]}`;
          const expr = math.compile(expression)

          xValues = this.generateRange(-10, 10, 0.01);
          yValues = xValues.map(function (x) {
            return expr.evaluate({x: x})
          })
        }
        else if (this.constraintsFormArray.value[i][1] === 0) {
          expression = `(${this.constraintValues.at(i).value})/${this.constraintsFormArray.value[i][0]}`;
          const expr = math.compile(expression)

          yValues = this.generateRange(-10, 10, 0.01);
          xValues = yValues.map(function (x) {
            return expr.evaluate({x: x})
          })
        }
        else {
          expression = `(${this.constraintValues.at(i).value}-${this.constraintsFormArray.value[i][0]}*x)/${this.constraintsFormArray.value[i][1]}`;
          const expr = math.compile(expression)

          xValues = this.generateRange(-10, 10, 0.01);
          yValues = xValues.map(function (x) {
            return expr.evaluate({x: x})
          })
        }
        const trace : Data= {
          x: xValues,
          y: yValues,
          type: 'scatter',
          name: expression
        }
        console.log(trace);
        this.data.push(trace);
      }
      const trace : Data= {
        x: [this.getResults()[0]],
        y: [this.getResults()[1]],
        type: 'scatter',
        name: 'Оптимальная точка'
      }
      this.data.push(trace);
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
      //results.push(this.results["x"+(i+1).toString()])
    }
    return results;
  }
}


