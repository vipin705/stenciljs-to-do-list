import { Component, Event, EventEmitter, h, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'my-paginator',
  shadow: true,
  styleUrl: './paginator.css',
})
export class Paginator {
  @Prop({ reflect: true, mutable: true }) pages: number;
  pageElements: HTMLDivElement[] = [];
  @Event({ bubbles: true, composed: true }) clickedPage: EventEmitter<number>;

  selectedPage(page: number) {
    this.clickedPage.emit(page);
  }

  createPages(pages: number) {
    for (let i = 0; i < pages; i++) {
      this.pageElements = [...this.pageElements, <div onClick={this.selectedPage.bind(this, i + 1)}>{i + 1}</div>];
    }
  }

  @Watch('pages')
  recreatePages(newVal: number, oldVal: number) {
    if (newVal === oldVal) {
      return;
    }
    this.pageElements = [];
    this.createPages(newVal);
  }
  componentWillLoad() {
    this.createPages(this.pages);
  }

  render() {
    return [<div class="paginator">{this.pageElements}</div>];
  }
}
