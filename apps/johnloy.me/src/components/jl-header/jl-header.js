import { LitElement, html, render, css } from "lit";

export const tagName = "jl-header";

export const criticalStyles = css`
  p {
    border: 1px solid purple;
  }
`;

// const styles = [
//   css`
//     ::slotted(p) {
//       color: pink;
//     }
//   `
// ];

// console.log(styles);

export class JlHeader extends LitElement {
  static properties = {
    hydrated: { type: Boolean }
  };
  static styles = [
    css`
      p {
        color: pink !important;
      }
    `
  ];
  constructor() {
    super();
    this.hydrated = false;
  }
  connectedCallback() {
    super.connectedCallback();
    // const initContent = this.shadowRoot.querySelector(
    //   'slot[name="initial-content"]'
    // );
    // console.log(initContent);
    // this.requestUpdate()
  }
  firstUpdated() {
    this.hydrated = true;
  }
  render() {
    // console.log('render')
    // console.log(import.meta.env.SSR);
    return html` <p>Yay! I'm alive.</p> `
  }
}

customElements.define(tagName, JlHeader);
