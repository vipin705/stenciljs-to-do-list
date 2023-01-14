import { Component, Prop, h, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'my-list-view',
  styleUrl: './list-view.css',
  shadow: true,
})
export class ListView {
  @Prop() listItems: Array<string | number>;
  @Event({ bubbles: true, composed: true }) completedTaskNumber: EventEmitter<number>;
  @Event({ bubbles: true, composed: true }) removeTask: EventEmitter<number>;

  completeTask = (taskNumber: number) => {
    this.completedTaskNumber.emit(taskNumber);
  };

  onTaskDelete(tasknumber: number) {
    this.removeTask.emit(tasknumber);
  }

  render() {
    return [
      <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>,
      <script src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>,
      <ul class="listitems">
        {this.listItems &&
          this.listItems.slice().map((task, index) => {
            return [
              <li class="item">
                <div class="icon-container">
                  <span>{index + 1}</span>
                  <ion-icon class="icon task-icon" name="checkmark-circle-outline" onClick={() => this.completeTask(index)}></ion-icon>
                </div>
                <div class="task-desc">{task}</div>
                <ion-icon class="icon" name="trash-outline" onClick={() => this.onTaskDelete(index)}></ion-icon>
              </li>,
            ];
          })}
      </ul>,
    ];
  }
}
