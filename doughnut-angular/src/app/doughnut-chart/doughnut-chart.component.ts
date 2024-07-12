import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss']
})
export class DoughnutChartComponent {
  @Input() initialValues: number[] = [];
  angleOffset: number = -90;
  chartData: any[] = [];
  colors: string[] = ["#6495ED", "goldenrod", "#cd5c5c", "thistle", "lightgray"];
  cx: number = 80;
  cy: number = 80;		      
  radius: number = 60;
  sortedValues: number[] = [];
  strokeWidth: number = 30;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialValues']) {
      this.sortInitialValues();
      this.calculateChartData();
    }
  }

  get adjustedCircumference() {
    return this.circumference - 2;
  }

  calculateChartData() {
    this.sortedValues.forEach((dataVal, index) => {
      const { x, y } = this.calculateTextCoords(dataVal, this.angleOffset);       
      const data = {
        degrees: this.angleOffset,
        textX: x,
        textY: y
      };
      this.chartData.push(data);
      this.angleOffset = this.dataPercentage(dataVal) * 360 + this.angleOffset;
    });
  }

  get circumference() {
    return 2 * Math.PI * this.radius;
  }

  get dataTotal() {
    return this.sortedValues.reduce((acc, val) => acc + val, 0);
  }

  sortInitialValues() {
    this.sortedValues = [...this.initialValues].sort((a, b) => b - a);
  }

  calculateTextCoords(dataVal: number, angleOffset: number) {
    const angle = (this.dataPercentage(dataVal) * 360) / 2 + angleOffset;
    const radians = this.degreesToRadians(angle);

    return {
      x: (this.radius * Math.cos(radians) + this.cx),
      y: (this.radius * Math.sin(radians) + this.cy)
    };
  }

  calculateStrokeDashOffset(dataVal: number, circumference: number) {
    const strokeDiff = this.dataPercentage(dataVal) * circumference;
    return circumference - strokeDiff;
  }

  dataPercentage(dataVal: number) {
    return dataVal / this.dataTotal;
  }

  degreesToRadians(angle: number) {
    return angle * (Math.PI / 180);
  }

  percentageLabel(dataVal: number) {
    return `${Math.round(this.dataPercentage(dataVal) * 100)}%`;
  }

  returnCircleTransformValue(index: number) {
    return `rotate(${this.chartData[index].degrees}, ${this.cx}, ${this.cy})`;
  }
}
