export default {
    functional: true,
    render: function (h, ctx) {
      var item = ctx.props.item;
      return h('li', ctx.data, [
        h('div', {
          attrs: {
            class: 'item'
          }
        }, [item.value]),
        h('span', {
          attrs: {
            class: 'subitem'
          }
        }, [item.subValue])
      ]);
    },
    props: {
      item: {
        type: Object,
        required: true
      }
    }
  };