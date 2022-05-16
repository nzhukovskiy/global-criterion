import { Component, OnInit } from '@angular/core';
//import functionPlot from "function-plot";
//import * as Simplex from "simple-simplex";
import * as math from "mathjs";
import * as Solver from "javascript-lp-solver";
//import * as GLPK from "glpk.js";
import { loadModule, Model } from 'glpk-ts';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  form = this.fb.group({
      variables: this.fb.array([]),
      criteria: this.fb.array([])
  });

  get criteria() {
    return this.form.controls["criteria"] as FormArray;
  }
  rows=5;
  cols=3;
  formArray =new FormArray([]);
  constraintsFormArray =new FormArray([]);
  constructor(private fb:FormBuilder) {

  }

  criteriaCountValues : number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  variableCountValues : number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  constraintCountValues : number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  criteriaCount: number = 2;
  variablesCount: number = 2;
  constraintsCount: number = 2;
  selectedCriteriaCount: number = 2;
  selectedVariablesCount: number = 2;
  selectedConstraintsCount: number = 2;
  globalCriterion: number = 0;
  criterionGoal : string[] = [];
  criterionThreshold : number[] = [];
  constraintType : string[] = [];
  constraintValues : number[] = [];
  optimizationGoal: string = "max";
  results: any;
  data: number[][] = [[1, 2, 3],[4, 5, 6]];
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
      this.criterionThreshold.push(0);
    }
    for (let i = 0; i < this.constraintsCount; i++) {
      this.constraintType.push("max");
      this.constraintValues.push(0);
    }
    console.log(this.formArray);
    /*this.data.forEach( el => {
      this.addCriteriaForm(el);
    })
    console.log(this.criteria)*/
    /*this.addCriteriaForm();
    this.addCriteriaForm();
    this.addCriteriaForm();*/
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
    /*const solver = new Simplex({
      objective: {
        a: 70,
        b: 210,
        c: 140,
      },
      constraints: [
        {
          namedVector: { a: 1, b: 1, c: 1 },
          constraint: '<=',
          constant: 100,
        },
        {
          namedVector: { a: 5, b: 4, c: 4 },
          constraint: '<=',
          constant: 480,
        },
        {
          namedVector: { a: 40, b: 20, c: 30 },
          constraint: '<=',
          constant: 3200,
        },
      ],
      optimizationType: 'max',
    });*/
    /*const result = solver.solve({
      methodName: 'simplex',
    });


    console.log({
      solution: result.solution,
      isOptimal: result.details.isOptimal,
    });*/
    //let simplex = new Simp
    /*functionPlot({
      target: "#plot",
      width,
      height,
      yAxis: { domain: [-1, 9] },
      grid: true,
      data: [
        {
          fn: "x^2",
          derivative: {
            fn: "2 * x",
            updateOnMouseMove: true
          }
        }
      ]
    })*/
  }
  getFormArray(control: AbstractControl) { return control as FormArray; }
  getFormControl(control: AbstractControl) { return control as FormControl; }
  getFormGroup(control: AbstractControl) { return control as FormGroup; }
  changeCriteriaCount(newValue: number) {
    this.criteriaCount = newValue;
    this.resizeMatrix();
    console.log("HIII");
  }
  changeVariablesCount(newValue: number) {
    this.variablesCount = newValue;
    this.resizeMatrix();
    this.resizeConstraintsMatrix();
    console.log("HIII");
  }
  changeConstraintsCount(newValue: number) {
    this.constraintsCount = newValue;
    this.resizeConstraintsMatrix();
    console.log("HIII");
  }

  addCriteriaForm(newValue: number[]) {
    const obj = new FormArray([]);
    newValue.forEach(el => {
      obj.push(this.fb.group({
        value: el
      }))
    })
    this.criteria.push(obj);
    /*const obj = new FormArray([]);
    obj.push(this.fb.group({
      value: newValue
    }))*/
    /*this.criteria.push(this.fb.group({
      value: 'B'
    }));*/
    //this.criteria.push(obj);

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
    this.criterionGoal = [];
    for (let i = 0; i < this.criteriaCount; i++) {
      this.criterionGoal.push("max");
    }
    this.criterionThreshold = [];
    for (let i = 0; i < this.criteriaCount; i++) {
      this.criterionThreshold.push(0);
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
    let oldConstraintValues = this.constraintValues;
    this.constraintValues = [];
    for (let i = 0; i < this.constraintsCount; i++) {
      if (i < oldConstraintValues.length) {
        this.constraintValues.push(oldConstraintValues[i]);
      }
      else {
        this.constraintValues.push(0);
      }
    }
    console.log(this.constraintValues);
  }
  solveTask() {
    //console.log(this.constraintType);
    //console.log(this.constraintValues);
    console.log(this.globalCriterion);
    let constraintModel : Record<string, any>= {}

    //Criteria matrix
    for (let i = 0; i < this.criteriaCount; i++) {
      if (i !== this.globalCriterion) {
        let constraintTypeModel : Record<string, any>= {}
        constraintTypeModel[this.criterionGoal[i]] = this.criterionThreshold[i];
        console.log(constraintTypeModel);
        constraintModel["u"+(i+1).toString()] = constraintTypeModel;
        console.log(constraintModel);
      }
    }
    let variablesModel: Record<string, any>= {}
    for (let j = 0; j < this.variablesCount; j++) {
      let variableCriterionModel : Record<string, any>= {}
      for (let i = 0; i < this.criteriaCount; i++) {
        variableCriterionModel["u"+(i+1).toString()] = this.formArray.value[i][j];
      }
      for (let i = 0; i < this.constraintsCount; i++) {
        variableCriterionModel["u"+(this.criteriaCount +i+1).toString()] = this.formArray.value[i][j];
      }
      variablesModel["x"+(j+1).toString()] = variableCriterionModel;
    }
    //Constraints matrix
    for (let i = 0; i < this.constraintsCount; i++) {
        let constraintTypeModel : Record<string, any>= {}
        constraintTypeModel[this.constraintType[i]] = this.constraintValues[i];
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
        "variables": variablesModel
      };

    results = solver.Solve(model);
    console.log(results);
    this.results = results;
    console.log(this.formArray.value);
  }
  getResults() {
    let results = [];
    for (let i = 0; i < this.variablesCount; i++) {
      results.push(this.results["x"+(i+1).toString()])
    }
    return results.reverse();
  }
  trackByIdx(index: number, obj: any): any {
    return index;
  }
}


