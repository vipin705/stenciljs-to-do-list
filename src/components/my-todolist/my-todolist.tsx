import { Component, h, State, Event, EventEmitter, Listen, Element } from '@stencil/core';

@Component({
  tag: 'my-to-do-list',
  styleUrl: './my-todolist.css',
  shadow: true,
})
export class MyToDOList {
  taskInput: HTMLInputElement;
  @State() taskValue: string;
  @State() addedTasks: Array<any> = [];
  taskItem: HTMLElement;
  @Element() el: HTMLElement;

  @Event({ bubbles: true, composed: true }) removeTask: EventEmitter<number>;
  @Event({ bubbles: true, composed: true }) completedTaskNumber: EventEmitter<number>;

  getTask = (event: Event) => {
    event.preventDefault();
    if (this.taskInput.value === '') {
      return;
    }
    this.taskValue = this.taskInput.value;
    this.addedTasks = [...this.addedTasks, this.taskValue];
    this.taskInput.value = '';
    this.addToLocalStorage(this.addedTasks);
  };

  onTaskDelete(tasknumber: number) {
    this.removeTask.emit(tasknumber);
  }

  @Listen('removeTask', { target: 'body' })
  removeFromList(event: CustomEvent) {
    this.addedTasks.length > 1 ? this.addedTasks.splice(event.detail, 1) : this.addedTasks.pop();
    this.addedTasks = [...this.addedTasks];
    this.addToLocalStorage(this.addedTasks);
  }

  @Listen('completedTaskNumber')
  markTaskComplete(event: CustomEvent) {
    this.el.shadowRoot.querySelectorAll('.item')[event.detail].classList.add('complete-task');
  }

  @Listen('clickedPage', { target: 'body' })
  displayPageItems(event: CustomEvent) {
    console.log(event.detail);
  }
  completeTask = (taskNumber: number) => {
    this.completedTaskNumber.emit(taskNumber);
  };

  createPages() {
    const pages = this.addedTasks.length % 5 === 0 ? Math.floor(this.addedTasks.length / 5) : Math.floor(this.addedTasks.length / 5) + 1;
    return pages;
  }

  addToLocalStorage(tasks: any[]) {
    localStorage.setItem('to-do-list', JSON.stringify(tasks));
  }

  componentWillLoad() {
    this.addedTasks = JSON.parse(localStorage.getItem('to-do-list'));
  }

  render() {
    return [
      <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>,
      <script src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>,
      <div class="todolist">
        <section class="main"> My to do list</section>
        <section class="content">
          <form class="addtask" onSubmit={this.getTask.bind(this)}>
            <input type="text" placeholder="add your task..." class="task" ref={ele => (this.taskInput = ele)} />
            <button>Add</button>
          </form>
          <ul class="listitems">
            {this.addedTasks &&
              this.addedTasks.map((task, index) => {
                return [
                  <li
                    class="item"
                    ref={(ele: HTMLElement) => {
                      this.taskItem = ele;
                    }}
                  >
                    <div class="icon-container">
                      <span>{index + 1}</span>
                      <ion-icon class="icon task-icon" name="checkmark-circle-outline" onClick={this.completeTask.bind(this, index)}></ion-icon>
                    </div>
                    <div class="task-desc">{task}</div>
                    <ion-icon class="icon" name="trash-outline" onClick={this.onTaskDelete.bind(this, index)}></ion-icon>
                  </li>,
                ];
              })}
          </ul>
        </section>
        {this.addedTasks.length > 5 && <my-paginator pages={this.createPages()}></my-paginator>}
      </div>,
    ];
  }
}
