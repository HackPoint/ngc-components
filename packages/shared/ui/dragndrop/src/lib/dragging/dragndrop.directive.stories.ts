import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { DraggingDirective } from './dragging.directive';

export default {
  title: 'DraggingDirective',
  component: DraggingDirective,
  decorators: [
    moduleMetadata({
      imports: []
    })
  ]
} as Meta<DraggingDirective>;


const Template: Story<DraggingDirective> = (args: DraggingDirective) => ({
  props: {
    ...args
  },
  styles: [
    `
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
          "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      }

      html,
      body {
        height: 100%;
      }

      .boundary {
          width:200px; /* width of viewport in your case 100% */
          height:200px; /* height of viewport in your case 100% */
          overflow:hidden;
          margin:10px 0 0 0;
          border:1px solid #777;
       }

       img {
          position:relative; /* need this to make dragging easy */
          top:0;
          left:0;
          border:0 none transparent;
          overflow: hidden;
       }

      .free-dragging {
        box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
          0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
      }
      .example-handle {
        position: absolute;
        top: 10px;
        right: 10px;
        color: #ccc;
        cursor: move;
        width: 24px;
        height: 24px;
      }

    `,
  ],
  template: `
     <div class="boundary">
        <img ngcDrag ngcDraggingHandle src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/56901/dog2.jpg">
    </div>
  `
});


export const Primary = Template.bind({});
Primary.args = {

};
