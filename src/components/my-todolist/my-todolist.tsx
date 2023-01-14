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
  taskList: HTMLElement;
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

  @Listen('removeTask', { target: 'body' })
  removeFromList(event: CustomEvent) {
    this.addedTasks.length > 1 ? this.addedTasks.splice(event.detail, 1) : this.addedTasks.pop();
    this.addedTasks = [...this.addedTasks];
    this.addToLocalStorage(this.addedTasks);
  }

  @Listen('completedTaskNumber')
  markTaskComplete(event: CustomEvent) {
    this.taskList.shadowRoot.querySelectorAll('.item')[event.detail].classList.add('complete-task');
  }

  @Listen('clickedPage', { target: 'body' })
  displayPageItems(event: CustomEvent) {
    console.log(event.detail);
  }

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
      <div class="todolist">
        <section class="main"> My to do list</section>
        <section class="content">
          <form class="addtask" onSubmit={event => this.getTask(event)}>
            <input type="text" placeholder="add your task..." class="task" ref={ele => (this.taskInput = ele)} />
            <button>Add</button>
          </form>
          <my-list-view listItems={this.addedTasks} ref={ele => (this.taskList = ele)}></my-list-view>
        </section>
        {this.addedTasks.length > 5 && <my-paginator pages={this.createPages()}></my-paginator>}
      </div>,
    ];
  }
}
