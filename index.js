var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function(l, r) {
  if (!l || l.getElementById("livereloadscript"))
    return;
  r = l.createElement("script");
  r.async = 1;
  r.src = "//" + (self.location.host || "localhost").split(":")[0] + ":35729/livereload.js?snipver=1";
  r.id = "livereloadscript";
  l.getElementsByTagName("head")[0].appendChild(r);
})(self.document);
"use strict";
const siyuan = require("siyuan");
const index = "";
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function to_number(value) {
  return value === "" ? null : +value;
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.wholeText !== data)
    text2.data = data;
}
function set_input_value(input, value) {
  input.value = value == null ? "" : value;
}
function set_style(node, key, value, important) {
  if (value === null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? "important" : "");
  }
}
function select_option(select, value, mounting) {
  for (let i = 0; i < select.options.length; i += 1) {
    const option = select.options[i];
    if (option.__value === value) {
      option.selected = true;
      return;
    }
  }
  if (!mounting || value !== void 0) {
    select.selectedIndex = -1;
  }
}
function select_value(select) {
  const selected_option = select.querySelector(":checked");
  return selected_option && selected_option.__value;
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, cancelable, detail);
  return e;
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail, { cancelable = false } = {}) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail, { cancelable });
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
      return !event.defaultPrevented;
    }
    return true;
  };
}
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks = filtered;
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor, customElement) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
      if (component.$$.on_destroy) {
        component.$$.on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index2 = callbacks.indexOf(callback);
      if (index2 !== -1)
        callbacks.splice(index2, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
}
async function request(url, data) {
  let response = await siyuan.fetchSyncPost(url, data);
  let res = response.code === 0 ? response.data : null;
  return res;
}
async function sql(sql2) {
  let sqldata = {
    stmt: sql2
  };
  let url = "/api/query/sql";
  return request(url, sqldata);
}
async function version() {
  return request("/api/system/version", {});
}
function create_fragment$2(ctx) {
  var _a;
  let div13;
  let div0;
  let t1;
  let div1;
  let t2;
  let div2;
  let t3;
  let t4_value = (
    /*app*/
    ((_a = ctx[0]) == null ? void 0 : _a.appId) + ""
  );
  let t4;
  let t5;
  let div3;
  let t6;
  let div4;
  let t7;
  let div5;
  let t9;
  let div6;
  let t10;
  let div7;
  let t11;
  let span;
  let t12;
  let t13;
  let div8;
  let t14;
  let div9;
  let t15;
  let div10;
  let t16;
  let t17;
  let t18;
  let div11;
  let t19;
  let div12;
  return {
    c() {
      div13 = element("div");
      div0 = element("div");
      div0.textContent = "appId:";
      t1 = space();
      div1 = element("div");
      t2 = space();
      div2 = element("div");
      t3 = text("$");
      t4 = text(t4_value);
      t5 = space();
      div3 = element("div");
      t6 = space();
      div4 = element("div");
      t7 = space();
      div5 = element("div");
      div5.textContent = "API demo:";
      t9 = space();
      div6 = element("div");
      t10 = space();
      div7 = element("div");
      t11 = text("System current time: ");
      span = element("span");
      t12 = text(
        /*time*/
        ctx[1]
      );
      t13 = space();
      div8 = element("div");
      t14 = space();
      div9 = element("div");
      t15 = space();
      div10 = element("div");
      t16 = text("Protyle demo: id = ");
      t17 = text(
        /*blockID*/
        ctx[3]
      );
      t18 = space();
      div11 = element("div");
      t19 = space();
      div12 = element("div");
      attr(div1, "class", "fn__hr");
      attr(div2, "class", "plugin-sample__time");
      attr(div3, "class", "fn__hr");
      attr(div4, "class", "fn__hr");
      attr(div6, "class", "fn__hr");
      attr(span, "id", "time");
      attr(div7, "class", "plugin-sample__time");
      attr(div8, "class", "fn__hr");
      attr(div9, "class", "fn__hr");
      attr(div11, "class", "fn__hr");
      attr(div12, "id", "protyle");
      set_style(div12, "height", "360px");
      attr(div13, "class", "b3-dialog__content");
    },
    m(target, anchor) {
      insert(target, div13, anchor);
      append(div13, div0);
      append(div13, t1);
      append(div13, div1);
      append(div13, t2);
      append(div13, div2);
      append(div2, t3);
      append(div2, t4);
      append(div13, t5);
      append(div13, div3);
      append(div13, t6);
      append(div13, div4);
      append(div13, t7);
      append(div13, div5);
      append(div13, t9);
      append(div13, div6);
      append(div13, t10);
      append(div13, div7);
      append(div7, t11);
      append(div7, span);
      append(span, t12);
      append(div13, t13);
      append(div13, div8);
      append(div13, t14);
      append(div13, div9);
      append(div13, t15);
      append(div13, div10);
      append(div10, t16);
      append(div10, t17);
      append(div13, t18);
      append(div13, div11);
      append(div13, t19);
      append(div13, div12);
      ctx[4](div12);
    },
    p(ctx2, [dirty]) {
      var _a2;
      if (dirty & /*app*/
      1 && t4_value !== (t4_value = /*app*/
      ((_a2 = ctx2[0]) == null ? void 0 : _a2.appId) + ""))
        set_data(t4, t4_value);
      if (dirty & /*time*/
      2)
        set_data(
          t12,
          /*time*/
          ctx2[1]
        );
      if (dirty & /*blockID*/
      8)
        set_data(
          t17,
          /*blockID*/
          ctx2[3]
        );
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div13);
      ctx[4](null);
    }
  };
}
function instance$2($$self, $$props, $$invalidate) {
  let { app } = $$props;
  let time = "";
  let divProtyle;
  let protyle;
  let blockID = "";
  onMount(async () => {
    await version();
    siyuan.fetchPost("/api/system/currentTime", {}, (response) => {
      $$invalidate(1, time = new Date(response.data).toString());
    });
    protyle = await initProtyle();
  });
  onDestroy(() => {
    siyuan.showMessage("Hello panel closed");
    protyle.destroy();
  });
  async function initProtyle() {
    let sql$1 = "SELECT * FROM blocks ORDER BY RANDOM () LIMIT 1;";
    let blocks = await sql(sql$1);
    $$invalidate(3, blockID = blocks[0].id);
    return new siyuan.Protyle(app, divProtyle, { blockId: blockID });
  }
  function div12_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      divProtyle = $$value;
      $$invalidate(2, divProtyle);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("app" in $$props2)
      $$invalidate(0, app = $$props2.app);
  };
  return [app, time, divProtyle, blockID, div12_binding];
}
class Hello extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$2, create_fragment$2, safe_not_equal, { app: 0 });
  }
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[15] = list[i][0];
  child_ctx[7] = list[i][1];
  return child_ctx;
}
function create_if_block_4(ctx) {
  let div;
  let input;
  let input_min_value;
  let input_max_value;
  let input_step_value;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      input = element("input");
      attr(input, "class", "b3-slider fn__size200");
      attr(input, "id", "fontSize");
      attr(input, "min", input_min_value = /*slider*/
      ctx[6].min);
      attr(input, "max", input_max_value = /*slider*/
      ctx[6].max);
      attr(input, "step", input_step_value = /*slider*/
      ctx[6].step);
      attr(input, "type", "range");
      attr(div, "class", "b3-tooltips b3-tooltips__n");
      attr(
        div,
        "aria-label",
        /*settingValue*/
        ctx[0]
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, input);
      set_input_value(
        input,
        /*settingValue*/
        ctx[0]
      );
      if (!mounted) {
        dispose = [
          listen(
            input,
            "change",
            /*input_change_input_handler*/
            ctx[13]
          ),
          listen(
            input,
            "input",
            /*input_change_input_handler*/
            ctx[13]
          ),
          listen(
            input,
            "change",
            /*changed*/
            ctx[9]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*slider*/
      64 && input_min_value !== (input_min_value = /*slider*/
      ctx2[6].min)) {
        attr(input, "min", input_min_value);
      }
      if (dirty & /*slider*/
      64 && input_max_value !== (input_max_value = /*slider*/
      ctx2[6].max)) {
        attr(input, "max", input_max_value);
      }
      if (dirty & /*slider*/
      64 && input_step_value !== (input_step_value = /*slider*/
      ctx2[6].step)) {
        attr(input, "step", input_step_value);
      }
      if (dirty & /*settingValue, Object, options*/
      33) {
        set_input_value(
          input,
          /*settingValue*/
          ctx2[0]
        );
      }
      if (dirty & /*settingValue, Object, options*/
      33) {
        attr(
          div,
          "aria-label",
          /*settingValue*/
          ctx2[0]
        );
      }
    },
    d(detaching) {
      if (detaching)
        detach(div);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_3(ctx) {
  let select;
  let mounted;
  let dispose;
  let each_value = Object.entries(
    /*options*/
    ctx[5]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  return {
    c() {
      select = element("select");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(select, "class", "b3-select fn__flex-center fn__size200");
      attr(select, "id", "iconPosition");
      if (
        /*settingValue*/
        ctx[0] === void 0
      )
        add_render_callback(() => (
          /*select_change_handler*/
          ctx[12].call(select)
        ));
    },
    m(target, anchor) {
      insert(target, select, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(select, null);
        }
      }
      select_option(
        select,
        /*settingValue*/
        ctx[0],
        true
      );
      if (!mounted) {
        dispose = [
          listen(
            select,
            "change",
            /*select_change_handler*/
            ctx[12]
          ),
          listen(
            select,
            "change",
            /*changed*/
            ctx[9]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*Object, options*/
      32) {
        each_value = Object.entries(
          /*options*/
          ctx2[5]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(select, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (dirty & /*settingValue, Object, options*/
      33) {
        select_option(
          select,
          /*settingValue*/
          ctx2[0]
        );
      }
    },
    d(detaching) {
      if (detaching)
        detach(select);
      destroy_each(each_blocks, detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_2(ctx) {
  let button;
  let t;
  let mounted;
  let dispose;
  return {
    c() {
      button = element("button");
      t = text(
        /*settingValue*/
        ctx[0]
      );
      attr(button, "class", "b3-button b3-button--outline fn__flex-center fn__size200");
      attr(
        button,
        "id",
        /*settingKey*/
        ctx[3]
      );
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, t);
      if (!mounted) {
        dispose = listen(
          button,
          "click",
          /*clicked*/
          ctx[8]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*settingValue*/
      1)
        set_data(
          t,
          /*settingValue*/
          ctx2[0]
        );
      if (dirty & /*settingKey*/
      8) {
        attr(
          button,
          "id",
          /*settingKey*/
          ctx2[3]
        );
      }
    },
    d(detaching) {
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_1(ctx) {
  let input;
  let mounted;
  let dispose;
  return {
    c() {
      input = element("input");
      attr(input, "class", "b3-text-field fn__flex-center fn__size200");
      attr(
        input,
        "id",
        /*settingKey*/
        ctx[3]
      );
      attr(
        input,
        "placeholder",
        /*placeholder*/
        ctx[4]
      );
    },
    m(target, anchor) {
      insert(target, input, anchor);
      set_input_value(
        input,
        /*settingValue*/
        ctx[0]
      );
      if (!mounted) {
        dispose = [
          listen(
            input,
            "input",
            /*input_input_handler*/
            ctx[11]
          ),
          listen(
            input,
            "change",
            /*changed*/
            ctx[9]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*settingKey*/
      8) {
        attr(
          input,
          "id",
          /*settingKey*/
          ctx2[3]
        );
      }
      if (dirty & /*placeholder*/
      16) {
        attr(
          input,
          "placeholder",
          /*placeholder*/
          ctx2[4]
        );
      }
      if (dirty & /*settingValue, Object, options*/
      33 && input.value !== /*settingValue*/
      ctx2[0]) {
        set_input_value(
          input,
          /*settingValue*/
          ctx2[0]
        );
      }
    },
    d(detaching) {
      if (detaching)
        detach(input);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block(ctx) {
  let input;
  let mounted;
  let dispose;
  return {
    c() {
      input = element("input");
      attr(input, "class", "b3-switch fn__flex-center");
      attr(
        input,
        "id",
        /*settingKey*/
        ctx[3]
      );
      attr(input, "type", "checkbox");
    },
    m(target, anchor) {
      insert(target, input, anchor);
      input.checked = /*settingValue*/
      ctx[0];
      if (!mounted) {
        dispose = [
          listen(
            input,
            "change",
            /*input_change_handler*/
            ctx[10]
          ),
          listen(
            input,
            "change",
            /*changed*/
            ctx[9]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*settingKey*/
      8) {
        attr(
          input,
          "id",
          /*settingKey*/
          ctx2[3]
        );
      }
      if (dirty & /*settingValue, Object, options*/
      33) {
        input.checked = /*settingValue*/
        ctx2[0];
      }
    },
    d(detaching) {
      if (detaching)
        detach(input);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_each_block(ctx) {
  let option;
  let t_value = (
    /*text*/
    ctx[7] + ""
  );
  let t;
  let option_value_value;
  return {
    c() {
      option = element("option");
      t = text(t_value);
      option.__value = option_value_value = /*value*/
      ctx[15];
      option.value = option.__value;
    },
    m(target, anchor) {
      insert(target, option, anchor);
      append(option, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*options*/
      32 && t_value !== (t_value = /*text*/
      ctx2[7] + ""))
        set_data(t, t_value);
      if (dirty & /*options*/
      32 && option_value_value !== (option_value_value = /*value*/
      ctx2[15])) {
        option.__value = option_value_value;
        option.value = option.__value;
      }
    },
    d(detaching) {
      if (detaching)
        detach(option);
    }
  };
}
function create_fragment$1(ctx) {
  let label;
  let div1;
  let t0;
  let t1;
  let div0;
  let t2;
  let t3;
  let span;
  let t4;
  function select_block_type(ctx2, dirty) {
    if (
      /*type*/
      ctx2[1] === "checkbox"
    )
      return create_if_block;
    if (
      /*type*/
      ctx2[1] === "input"
    )
      return create_if_block_1;
    if (
      /*type*/
      ctx2[1] === "button"
    )
      return create_if_block_2;
    if (
      /*type*/
      ctx2[1] === "select"
    )
      return create_if_block_3;
    if (
      /*type*/
      ctx2[1] == "slider"
    )
      return create_if_block_4;
  }
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type && current_block_type(ctx);
  return {
    c() {
      label = element("label");
      div1 = element("div");
      t0 = text(
        /*title*/
        ctx[2]
      );
      t1 = space();
      div0 = element("div");
      t2 = text(
        /*text*/
        ctx[7]
      );
      t3 = space();
      span = element("span");
      t4 = space();
      if (if_block)
        if_block.c();
      attr(div0, "class", "b3-label__text");
      attr(div1, "class", "fn__flex-1");
      attr(span, "class", "fn__space");
      attr(label, "class", "fn__flex b3-label");
    },
    m(target, anchor) {
      insert(target, label, anchor);
      append(label, div1);
      append(div1, t0);
      append(div1, t1);
      append(div1, div0);
      append(div0, t2);
      append(label, t3);
      append(label, span);
      append(label, t4);
      if (if_block)
        if_block.m(label, null);
    },
    p(ctx2, [dirty]) {
      if (dirty & /*title*/
      4)
        set_data(
          t0,
          /*title*/
          ctx2[2]
        );
      if (dirty & /*text*/
      128)
        set_data(
          t2,
          /*text*/
          ctx2[7]
        );
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if (if_block)
          if_block.d(1);
        if_block = current_block_type && current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(label, null);
        }
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(label);
      if (if_block) {
        if_block.d();
      }
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let { type } = $$props;
  let { title } = $$props;
  let { text: text2 } = $$props;
  let { settingKey } = $$props;
  let { settingValue } = $$props;
  let { placeholder = "" } = $$props;
  let { options = {} } = $$props;
  let { slider = { min: 0, max: 100, step: 1 } } = $$props;
  const dispatch = createEventDispatcher();
  function clicked() {
    dispatch("clicked");
  }
  function changed() {
    dispatch("changed", { key: settingKey, value: settingValue });
  }
  function input_change_handler() {
    settingValue = this.checked;
    $$invalidate(0, settingValue);
    $$invalidate(5, options);
  }
  function input_input_handler() {
    settingValue = this.value;
    $$invalidate(0, settingValue);
    $$invalidate(5, options);
  }
  function select_change_handler() {
    settingValue = select_value(this);
    $$invalidate(0, settingValue);
    $$invalidate(5, options);
  }
  function input_change_input_handler() {
    settingValue = to_number(this.value);
    $$invalidate(0, settingValue);
    $$invalidate(5, options);
  }
  $$self.$$set = ($$props2) => {
    if ("type" in $$props2)
      $$invalidate(1, type = $$props2.type);
    if ("title" in $$props2)
      $$invalidate(2, title = $$props2.title);
    if ("text" in $$props2)
      $$invalidate(7, text2 = $$props2.text);
    if ("settingKey" in $$props2)
      $$invalidate(3, settingKey = $$props2.settingKey);
    if ("settingValue" in $$props2)
      $$invalidate(0, settingValue = $$props2.settingValue);
    if ("placeholder" in $$props2)
      $$invalidate(4, placeholder = $$props2.placeholder);
    if ("options" in $$props2)
      $$invalidate(5, options = $$props2.options);
    if ("slider" in $$props2)
      $$invalidate(6, slider = $$props2.slider);
  };
  return [
    settingValue,
    type,
    title,
    settingKey,
    placeholder,
    options,
    slider,
    text2,
    clicked,
    changed,
    input_change_handler,
    input_input_handler,
    select_change_handler,
    input_change_input_handler
  ];
}
class Setting_item extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, {
      type: 1,
      title: 2,
      text: 7,
      settingKey: 3,
      settingValue: 0,
      placeholder: 4,
      options: 5,
      slider: 6
    });
  }
}
function create_fragment(ctx) {
  let div3;
  let div2;
  let t4;
  let settingitem0;
  let t5;
  let settingitem1;
  let t6;
  let settingitem2;
  let t7;
  let settingitem3;
  let t8;
  let settingitem4;
  let current;
  settingitem0 = new Setting_item({
    props: {
      type: "checkbox",
      title: "Checkbox",
      text: "This is a checkbox",
      settingKey: "Checkbox",
      settingValue: true
    }
  });
  settingitem0.$on(
    "changed",
    /*changed_handler*/
    ctx[0]
  );
  settingitem1 = new Setting_item({
    props: {
      type: "input",
      title: "Input",
      text: "This is an input",
      settingKey: "Input",
      settingValue: "",
      placeholder: "Input something"
    }
  });
  settingitem1.$on(
    "changed",
    /*changed_handler_1*/
    ctx[1]
  );
  settingitem2 = new Setting_item({
    props: {
      type: "button",
      title: "Button",
      text: "This is a button",
      settingKey: "Button",
      settingValue: "Click me"
    }
  });
  settingitem2.$on(
    "clicked",
    /*clicked_handler*/
    ctx[2]
  );
  settingitem3 = new Setting_item({
    props: {
      type: "select",
      title: "Select",
      text: "This is a select",
      settingKey: "Select",
      settingValue: "left",
      options: {
        left: "Left",
        center: "Center",
        right: "Right"
      }
    }
  });
  settingitem3.$on(
    "changed",
    /*changed_handler_2*/
    ctx[3]
  );
  settingitem4 = new Setting_item({
    props: {
      type: "slider",
      title: "Slide",
      text: "This is a slide",
      settingKey: "Slide",
      settingValue: 50,
      slider: { min: 0, max: 100, step: 1 }
    }
  });
  settingitem4.$on(
    "changed",
    /*changed_handler_3*/
    ctx[4]
  );
  return {
    c() {
      div3 = element("div");
      div2 = element("div");
      div2.innerHTML = `<div class="fn_flex-1"><h4>This setting panel is provided by a svelte component</h4> 
            <div class="b3-label__text"><span class="fn__flex-1">See:
                    <pre style="display: inline">/lib/setting-pannel.svelte</pre></span></div></div>`;
      t4 = space();
      create_component(settingitem0.$$.fragment);
      t5 = space();
      create_component(settingitem1.$$.fragment);
      t6 = space();
      create_component(settingitem2.$$.fragment);
      t7 = space();
      create_component(settingitem3.$$.fragment);
      t8 = space();
      create_component(settingitem4.$$.fragment);
      attr(div2, "data-type", "Header");
      attr(div2, "class", "fn__flex b3-label");
      attr(div3, "class", "config__tab-container");
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      append(div3, div2);
      append(div3, t4);
      mount_component(settingitem0, div3, null);
      append(div3, t5);
      mount_component(settingitem1, div3, null);
      append(div3, t6);
      mount_component(settingitem2, div3, null);
      append(div3, t7);
      mount_component(settingitem3, div3, null);
      append(div3, t8);
      mount_component(settingitem4, div3, null);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(settingitem0.$$.fragment, local);
      transition_in(settingitem1.$$.fragment, local);
      transition_in(settingitem2.$$.fragment, local);
      transition_in(settingitem3.$$.fragment, local);
      transition_in(settingitem4.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(settingitem0.$$.fragment, local);
      transition_out(settingitem1.$$.fragment, local);
      transition_out(settingitem2.$$.fragment, local);
      transition_out(settingitem3.$$.fragment, local);
      transition_out(settingitem4.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div3);
      destroy_component(settingitem0);
      destroy_component(settingitem1);
      destroy_component(settingitem2);
      destroy_component(settingitem3);
      destroy_component(settingitem4);
    }
  };
}
function instance($$self) {
  onMount(() => {
    siyuan.showMessage("Setting panel opened");
  });
  onDestroy(() => {
    siyuan.showMessage("Setting panel closed");
  });
  const changed_handler = (event) => {
    siyuan.showMessage(`Checkbox changed: ${event.detail.key} = ${event.detail.value}`);
  };
  const changed_handler_1 = (event) => {
    siyuan.showMessage(`Input changed: ${event.detail.key} = ${event.detail.value}`);
  };
  const clicked_handler = () => {
    siyuan.showMessage("Button clicked");
  };
  const changed_handler_2 = (event) => {
    siyuan.showMessage(`Select changed: ${event.detail.key} = ${event.detail.value}`);
  };
  const changed_handler_3 = (event) => {
    siyuan.showMessage(`Slide changed: ${event.detail.key} = ${event.detail.value}`);
  };
  return [
    changed_handler,
    changed_handler_1,
    clicked_handler,
    changed_handler_2,
    changed_handler_3
  ];
}
class Setting_panel extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
class SettingUtils {
  constructor(plugin, name, callback, width, height) {
    __publicField(this, "plugin");
    __publicField(this, "name");
    __publicField(this, "file");
    __publicField(this, "settings", /* @__PURE__ */ new Map());
    __publicField(this, "elements", /* @__PURE__ */ new Map());
    this.name = name ?? "settings";
    this.plugin = plugin;
    this.file = this.name.endsWith(".json") ? this.name : `${this.name}.json`;
    this.plugin.setting = new siyuan.Setting({
      width,
      height,
      confirmCallback: () => {
        for (let key of this.settings.keys()) {
          this.updateValue(key);
        }
        let data = this.dump();
        if (callback !== void 0) {
          callback(data);
        } else {
          this.plugin.data[this.name] = data;
          this.save();
        }
      }
    });
  }
  async load() {
    let data = await this.plugin.loadData(this.file);
    console.debug("Load config:", data);
    if (data) {
      for (let [key, item] of this.settings) {
        item.value = (data == null ? void 0 : data[key]) ?? item.value;
      }
    }
    this.plugin.data[this.name] = this.dump();
    return data;
  }
  async save() {
    let data = this.dump();
    await this.plugin.saveData(this.file, this.dump());
    return data;
  }
  /**
   * Get setting item value
   * @param key key name
   * @returns setting item value
   */
  get(key) {
    var _a;
    return (_a = this.settings.get(key)) == null ? void 0 : _a.value;
  }
  /**
   * 将设置项目导出为 JSON 对象
   * @returns object
   */
  dump() {
    let data = {};
    for (let [key, item] of this.settings) {
      if (item.type === "button")
        continue;
      data[key] = item.value;
    }
    return data;
  }
  addItem(item) {
    var _a, _b, _c, _d, _e, _f;
    this.settings.set(item.key, item);
    let itemElement;
    switch (item.type) {
      case "checkbox":
        let element2 = document.createElement("input");
        element2.type = "checkbox";
        element2.checked = item.value;
        element2.className = "b3-switch fn__flex-center";
        itemElement = element2;
        break;
      case "select":
        let selectElement = document.createElement("select");
        selectElement.className = "b3-select fn__flex-center fn__size200";
        for (let option of ((_a = item.select) == null ? void 0 : _a.options) ?? []) {
          let optionElement = document.createElement("option");
          optionElement.value = option.val;
          optionElement.text = option.text;
          selectElement.appendChild(optionElement);
        }
        selectElement.value = item.value;
        itemElement = selectElement;
        break;
      case "slider":
        let sliderElement = document.createElement("input");
        sliderElement.type = "range";
        sliderElement.className = "b3-slider fn__size200 b3-tooltips b3-tooltips__n";
        sliderElement.ariaLabel = item.value;
        sliderElement.min = ((_b = item.slider) == null ? void 0 : _b.min.toString()) ?? "0";
        sliderElement.max = ((_c = item.slider) == null ? void 0 : _c.max.toString()) ?? "100";
        sliderElement.step = ((_d = item.slider) == null ? void 0 : _d.step.toString()) ?? "1";
        sliderElement.value = item.value;
        sliderElement.onchange = () => {
          sliderElement.ariaLabel = sliderElement.value;
        };
        itemElement = sliderElement;
        break;
      case "textinput":
        let textInputElement = document.createElement("input");
        textInputElement.className = "b3-text-field fn__flex-center fn__size200";
        textInputElement.value = item.value;
        itemElement = textInputElement;
        break;
      case "textarea":
        let textareaElement = document.createElement("textarea");
        textareaElement.className = "b3-text-field fn__block";
        textareaElement.value = item.value;
        itemElement = textareaElement;
        break;
      case "button":
        let buttonElement = document.createElement("button");
        buttonElement.className = "b3-button b3-button--outline fn__flex-center fn__size200";
        buttonElement.innerText = ((_e = item.button) == null ? void 0 : _e.label) ?? "Button";
        buttonElement.onclick = ((_f = item.button) == null ? void 0 : _f.callback) ?? (() => {
        });
        itemElement = buttonElement;
        break;
    }
    this.elements.set(item.key, itemElement);
    this.plugin.setting.addItem({
      title: item.title,
      description: item == null ? void 0 : item.description,
      createActionElement: () => {
        let element2 = this.getElement(item.key);
        return element2;
      }
    });
  }
  getElement(key) {
    let item = this.settings.get(key);
    let element2 = this.elements.get(key);
    switch (item.type) {
      case "checkbox":
        element2.checked = item.value;
        break;
      case "select":
        element2.value = item.value;
        break;
      case "slider":
        element2.value = item.value;
        element2.ariaLabel = item.value;
        break;
      case "textinput":
        element2.value = item.value;
        break;
      case "textarea":
        element2.value = item.value;
        break;
    }
    return element2;
  }
  updateValue(key) {
    let item = this.settings.get(key);
    let element2 = this.elements.get(key);
    switch (item.type) {
      case "checkbox":
        item.value = element2.checked;
        break;
      case "select":
        item.value = element2.value;
        break;
      case "slider":
        item.value = element2.value;
        break;
      case "textinput":
        item.value = element2.value;
        break;
      case "textarea":
        item.value = element2.value;
        break;
    }
  }
}
const STORAGE_NAME = "menu-config";
const TAB_TYPE = "custom_tab";
const DOCK_TYPE = "dock_tab";
class PluginSample extends siyuan.Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "customTab");
    __publicField(this, "isMobile");
    __publicField(this, "blockIconEventBindThis", this.blockIconEvent.bind(this));
    __publicField(this, "settingUtils");
  }
  async onload() {
    this.data[STORAGE_NAME] = { readonlyText: "Readonly" };
    console.log("loading plugin-sample", this.i18n);
    const frontEnd = siyuan.getFrontend();
    this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";
    this.addIcons(`<symbol id="iconFace" viewBox="0 0 32 32">
<path d="M13.667 17.333c0 0.92-0.747 1.667-1.667 1.667s-1.667-0.747-1.667-1.667 0.747-1.667 1.667-1.667 1.667 0.747 1.667 1.667zM20 15.667c-0.92 0-1.667 0.747-1.667 1.667s0.747 1.667 1.667 1.667 1.667-0.747 1.667-1.667-0.747-1.667-1.667-1.667zM29.333 16c0 7.36-5.973 13.333-13.333 13.333s-13.333-5.973-13.333-13.333 5.973-13.333 13.333-13.333 13.333 5.973 13.333 13.333zM14.213 5.493c1.867 3.093 5.253 5.173 9.12 5.173 0.613 0 1.213-0.067 1.787-0.16-1.867-3.093-5.253-5.173-9.12-5.173-0.613 0-1.213 0.067-1.787 0.16zM5.893 12.627c2.28-1.293 4.040-3.4 4.88-5.92-2.28 1.293-4.040 3.4-4.88 5.92zM26.667 16c0-1.040-0.16-2.040-0.44-2.987-0.933 0.2-1.893 0.32-2.893 0.32-4.173 0-7.893-1.92-10.347-4.92-1.4 3.413-4.187 6.093-7.653 7.4 0.013 0.053 0 0.12 0 0.187 0 5.88 4.787 10.667 10.667 10.667s10.667-4.787 10.667-10.667z"></path>
</symbol>
<symbol id="iconSaving" viewBox="0 0 32 32">
<path d="M20 13.333c0-0.733 0.6-1.333 1.333-1.333s1.333 0.6 1.333 1.333c0 0.733-0.6 1.333-1.333 1.333s-1.333-0.6-1.333-1.333zM10.667 12h6.667v-2.667h-6.667v2.667zM29.333 10v9.293l-3.76 1.253-2.24 7.453h-7.333v-2.667h-2.667v2.667h-7.333c0 0-3.333-11.28-3.333-15.333s3.28-7.333 7.333-7.333h6.667c1.213-1.613 3.147-2.667 5.333-2.667 1.107 0 2 0.893 2 2 0 0.28-0.053 0.533-0.16 0.773-0.187 0.453-0.347 0.973-0.427 1.533l3.027 3.027h2.893zM26.667 12.667h-1.333l-4.667-4.667c0-0.867 0.12-1.72 0.347-2.547-1.293 0.333-2.347 1.293-2.787 2.547h-8.227c-2.573 0-4.667 2.093-4.667 4.667 0 2.507 1.627 8.867 2.68 12.667h2.653v-2.667h8v2.667h2.68l2.067-6.867 3.253-1.093v-4.707z"></path>
</symbol>`);
    const topBarElement = this.addTopBar({
      icon: "iconFace",
      title: this.i18n.addTopBarIcon,
      position: "right",
      callback: () => {
        if (this.isMobile) {
          this.addMenu();
        } else {
          let rect = topBarElement.getBoundingClientRect();
          if (rect.width === 0) {
            rect = document.querySelector("#barMore").getBoundingClientRect();
          }
          if (rect.width === 0) {
            rect = document.querySelector("#barPlugins").getBoundingClientRect();
          }
          this.addMenu(rect);
        }
      }
    });
    const statusIconTemp = document.createElement("template");
    statusIconTemp.innerHTML = `<div class="toolbar__item ariaLabel" aria-label="Remove plugin-sample Data">
    <svg>
        <use xlink:href="#iconTrashcan"></use>
    </svg>
</div>`;
    statusIconTemp.content.firstElementChild.addEventListener("click", () => {
      siyuan.confirm("⚠️", this.i18n.confirmRemove.replace("${name}", this.name), () => {
        this.removeData(STORAGE_NAME).then(() => {
          this.data[STORAGE_NAME] = { readonlyText: "Readonly" };
          siyuan.showMessage(`[${this.name}]: ${this.i18n.removedData}`);
        });
      });
    });
    this.addStatusBar({
      element: statusIconTemp.content.firstElementChild
    });
    this.addCommand({
      langKey: "showDialog",
      hotkey: "⇧⌘O",
      callback: () => {
        this.showDialog();
      },
      fileTreeCallback: (file) => {
        console.log(file, "fileTreeCallback");
      },
      editorCallback: (protyle) => {
        console.log(protyle, "editorCallback");
      },
      dockCallback: (element2) => {
        console.log(element2, "dockCallback");
      }
    });
    this.addCommand({
      langKey: "getTab",
      hotkey: "⇧⌘M",
      globalCallback: () => {
        console.log(this.getOpenedTab());
      }
    });
    this.addDock({
      config: {
        position: "LeftBottom",
        size: { width: 200, height: 0 },
        icon: "iconSaving",
        title: "Custom Dock"
      },
      data: {
        text: "This is my custom dock"
      },
      type: DOCK_TYPE,
      resize() {
        console.log(DOCK_TYPE + " resize");
      },
      init() {
        this.element.innerHTML = `<div class="fn__flex-1 fn__flex-column">
    <div class="block__icons">
        <div class="block__logo">
            <svg><use xlink:href="#iconEmoji"></use></svg>
            Custom Dock
        </div>
        <span class="fn__flex-1 fn__space"></span>
        <span data-type="min" class="block__icon b3-tooltips b3-tooltips__sw" aria-label="Min ${siyuan.adaptHotkey("⌘W")}"><svg><use xlink:href="#iconMin"></use></svg></span>
    </div>
    <div class="fn__flex-1 plugin-sample__custom-dock">
        ${this.data.text}
    </div>
</div>`;
      },
      destroy() {
        console.log("destroy dock:", DOCK_TYPE);
      }
    });
    this.settingUtils = new SettingUtils(this, STORAGE_NAME);
    this.settingUtils.addItem({
      key: "Input",
      value: "",
      type: "textinput",
      title: "Readonly text",
      description: "Input description"
    });
    this.settingUtils.addItem({
      key: "InputArea",
      value: "",
      type: "textarea",
      title: "Readonly text",
      description: "Input description"
    });
    this.settingUtils.addItem({
      key: "Check",
      value: true,
      type: "checkbox",
      title: "Checkbox text",
      description: "Check description"
    });
    this.settingUtils.addItem({
      key: "Select",
      value: 1,
      type: "select",
      title: "Readonly text",
      description: "Select description",
      select: {
        options: [
          {
            val: 1,
            text: "Option 1"
          },
          {
            val: 2,
            text: "Option 2"
          }
        ]
      }
    });
    this.settingUtils.addItem({
      key: "Slider",
      value: 50,
      type: "slider",
      title: "Slider text",
      description: "Slider description",
      slider: {
        min: 0,
        max: 100,
        step: 1
      }
    });
    this.settingUtils.addItem({
      key: "Btn",
      value: "",
      type: "button",
      title: "Button",
      description: "Button description",
      button: {
        label: "Button",
        callback: () => {
          siyuan.showMessage("Button clicked");
        }
      }
    });
    this.protyleSlash = [{
      filter: ["insert pdf 😊", "插入pdf 😊", "crpdf"],
      html: `<div class="b3-list-item__first"><span class="b3-list-item__text">${this.i18n.insertEmoji}</span><span class="b3-list-item__meta">😊</span></div>`,
      id: "insertEmoji",
      async callback(protyle) {
        let menu = new siyuan.Menu("");
        let pdfList = await siyuan.fetchSyncPost("/api/search/searchAsset", { "k": ".pdf", "exts": [] });
        for (let pdfItem of pdfList.data) {
          menu.addItem({
            label: pdfItem.hName,
            click: () => {
              protyle.protyle.toolbar.range.deleteContents();
              protyle.insert(`<iframe sandbox="allow-forms allow-presentation allow-same-origin allow-scripts allow-modals" src="/plugins/siyuan-plugin-embedding-pdf/pdfReader/index.html?file=../../../${pdfItem.path}" data-src="" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width: 835px; height: 413px;"></iframe>`, true);
            }
          });
        }
        let { x, y } = protyle.protyle.toolbar.range.getBoundingClientRect();
        menu.open({
          x,
          y,
          w: 1e3
        });
      }
    }];
    console.log(this.i18n.helloPlugin);
  }
  onLayoutReady() {
    this.settingUtils.load();
    console.log(`frontend: ${siyuan.getFrontend()}; backend: ${siyuan.getBackend()}`);
    let tabDiv = document.createElement("div");
    new Hello({
      target: tabDiv,
      props: {
        app: this.app
      }
    });
    this.customTab = this.addTab({
      type: TAB_TYPE,
      init() {
        this.element.appendChild(tabDiv);
        console.log(this.element);
      },
      beforeDestroy() {
        console.log("before destroy tab:", TAB_TYPE);
      },
      destroy() {
        console.log("destroy tab:", TAB_TYPE);
      }
    });
  }
  async onunload() {
    console.log(this.i18n.byePlugin);
    await this.settingUtils.save();
    siyuan.showMessage("Goodbye SiYuan Plugin");
    console.log("onunload");
  }
  /**
   * A custom setting pannel provided by svelte
   */
  openDIYSetting() {
    let dialog = new siyuan.Dialog({
      title: "SettingPannel",
      content: `<div id="SettingPanel"></div>`,
      width: "600px",
      destroyCallback: (options) => {
        console.log("destroyCallback", options);
        pannel.$destroy();
      }
    });
    let pannel = new Setting_panel({
      target: dialog.element.querySelector("#SettingPanel")
    });
  }
  eventBusPaste(event) {
    event.preventDefault();
    event.detail.resolve({
      textPlain: event.detail.textPlain.trim()
    });
  }
  eventBusLog({ detail }) {
    console.log(detail);
  }
  blockIconEvent({ detail }) {
    detail.menu.addItem({
      iconHTML: "",
      label: this.i18n.removeSpace,
      click: () => {
        const doOperations = [];
        detail.blockElements.forEach((item) => {
          const editElement = item.querySelector('[contenteditable="true"]');
          if (editElement) {
            editElement.textContent = editElement.textContent.replace(/ /g, "");
            doOperations.push({
              id: item.dataset.nodeId,
              data: item.outerHTML,
              action: "update"
            });
          }
        });
        detail.protyle.getInstance().transaction(doOperations);
      }
    });
  }
  showDialog() {
    let dialog = new siyuan.Dialog({
      title: `SiYuan ${siyuan.Constants.SIYUAN_VERSION}`,
      content: `<div id="helloPanel" class="b3-dialog__content"></div>`,
      width: this.isMobile ? "92vw" : "720px",
      destroyCallback(options) {
      }
    });
    new Hello({
      target: dialog.element.querySelector("#helloPanel"),
      props: {
        app: this.app
      }
    });
  }
  addMenu(rect) {
    const menu = new siyuan.Menu("topBarSample", () => {
      console.log(this.i18n.byeMenu);
    });
    menu.addItem({
      icon: "iconInfo",
      label: "Dialog(open help first)",
      accelerator: this.commands[0].customHotkey,
      click: () => {
        this.showDialog();
      }
    });
    if (!this.isMobile) {
      menu.addItem({
        icon: "iconFace",
        label: "Open Custom Tab",
        click: () => {
          const tab = siyuan.openTab({
            app: this.app,
            custom: {
              icon: "iconFace",
              title: "Custom Tab",
              data: {
                text: "This is my custom tab"
              },
              id: this.name + TAB_TYPE
            }
          });
          console.log(tab);
        }
      });
      menu.addItem({
        icon: "iconImage",
        label: "Open Asset Tab(open help first)",
        click: () => {
          const tab = siyuan.openTab({
            app: this.app,
            asset: {
              path: "assets/paragraph-20210512165953-ag1nib4.svg"
            }
          });
          console.log(tab);
        }
      });
      menu.addItem({
        icon: "iconFile",
        label: "Open Doc Tab(open help first)",
        click: async () => {
          const tab = await siyuan.openTab({
            app: this.app,
            doc: {
              id: "20200812220555-lj3enxa"
            }
          });
          console.log(tab);
        }
      });
      menu.addItem({
        icon: "iconSearch",
        label: "Open Search Tab",
        click: () => {
          const tab = siyuan.openTab({
            app: this.app,
            search: {
              k: "SiYuan"
            }
          });
          console.log(tab);
        }
      });
      menu.addItem({
        icon: "iconRiffCard",
        label: "Open Card Tab",
        click: () => {
          const tab = siyuan.openTab({
            app: this.app,
            card: {
              type: "all"
            }
          });
          console.log(tab);
        }
      });
      menu.addItem({
        icon: "iconLayout",
        label: "Open Float Layer(open help first)",
        click: () => {
          this.addFloatLayer({
            ids: ["20210428212840-8rqwn5o", "20201225220955-l154bn4"],
            defIds: ["20230415111858-vgohvf3", "20200813131152-0wk5akh"],
            x: window.innerWidth - 768 - 120,
            y: 32
          });
        }
      });
      menu.addItem({
        icon: "iconOpenWindow",
        label: "Open Doc Window(open help first)",
        click: () => {
          siyuan.openWindow({
            doc: { id: "20200812220555-lj3enxa" }
          });
        }
      });
    }
    menu.addItem({
      icon: "iconScrollHoriz",
      label: "Event Bus",
      type: "submenu",
      submenu: [{
        icon: "iconSelect",
        label: "On ws-main",
        click: () => {
          this.eventBus.on("ws-main", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off ws-main",
        click: () => {
          this.eventBus.off("ws-main", this.eventBusLog);
        }
      }, {
        icon: "iconSelect",
        label: "On click-blockicon",
        click: () => {
          this.eventBus.on("click-blockicon", this.blockIconEventBindThis);
        }
      }, {
        icon: "iconClose",
        label: "Off click-blockicon",
        click: () => {
          this.eventBus.off("click-blockicon", this.blockIconEventBindThis);
        }
      }, {
        icon: "iconSelect",
        label: "On click-pdf",
        click: () => {
          this.eventBus.on("click-pdf", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off click-pdf",
        click: () => {
          this.eventBus.off("click-pdf", this.eventBusLog);
        }
      }, {
        icon: "iconSelect",
        label: "On click-editorcontent",
        click: () => {
          this.eventBus.on("click-editorcontent", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off click-editorcontent",
        click: () => {
          this.eventBus.off("click-editorcontent", this.eventBusLog);
        }
      }, {
        icon: "iconSelect",
        label: "On click-editortitleicon",
        click: () => {
          this.eventBus.on("click-editortitleicon", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off click-editortitleicon",
        click: () => {
          this.eventBus.off("click-editortitleicon", this.eventBusLog);
        }
      }, {
        icon: "iconSelect",
        label: "On open-noneditableblock",
        click: () => {
          this.eventBus.on("open-noneditableblock", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off open-noneditableblock",
        click: () => {
          this.eventBus.off("open-noneditableblock", this.eventBusLog);
        }
      }, {
        icon: "iconSelect",
        label: "On loaded-protyle-static",
        click: () => {
          this.eventBus.on("loaded-protyle-static", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off loaded-protyle-static",
        click: () => {
          this.eventBus.off("loaded-protyle-static", this.eventBusLog);
        }
      }, {
        icon: "iconSelect",
        label: "On loaded-protyle-dynamic",
        click: () => {
          this.eventBus.on("loaded-protyle-dynamic", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off loaded-protyle-dynamic",
        click: () => {
          this.eventBus.off("loaded-protyle-dynamic", this.eventBusLog);
        }
      }, {
        icon: "iconSelect",
        label: "On switch-protyle",
        click: () => {
          this.eventBus.on("switch-protyle", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off switch-protyle",
        click: () => {
          this.eventBus.off("switch-protyle", this.eventBusLog);
        }
      }, {
        icon: "iconSelect",
        label: "On destroy-protyle",
        click: () => {
          this.eventBus.on("destroy-protyle", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off destroy-protyle",
        click: () => {
          this.eventBus.off("destroy-protyle", this.eventBusLog);
        }
      }, {
        icon: "iconSelect",
        label: "On open-menu-doctree",
        click: () => {
          this.eventBus.on("open-menu-doctree", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off open-menu-doctree",
        click: () => {
          this.eventBus.off("open-menu-doctree", this.eventBusLog);
        }
      }, {
        icon: "iconSelect",
        label: "On open-menu-blockref",
        click: () => {
          this.eventBus.on("open-menu-blockref", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off open-menu-blockref",
        click: () => {
          this.eventBus.off("open-menu-blockref", this.eventBusLog);
        }
      }, {
        icon: "iconSelect",
        label: "On open-menu-fileannotationref",
        click: () => {
          this.eventBus.on("open-menu-fileannotationref", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off open-menu-fileannotationref",
        click: () => {
          this.eventBus.off("open-menu-fileannotationref", this.eventBusLog);
        }
      }, {
        icon: "iconSelect",
        label: "On open-menu-tag",
        click: () => {
          this.eventBus.on("open-menu-tag", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off open-menu-tag",
        click: () => {
          this.eventBus.off("open-menu-tag", this.eventBusLog);
        }
      }, {
        icon: "iconSelect",
        label: "On open-menu-link",
        click: () => {
          this.eventBus.on("open-menu-link", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off open-menu-link",
        click: () => {
          this.eventBus.off("open-menu-link", this.eventBusLog);
        }
      }, {
        icon: "iconSelect",
        label: "On open-menu-image",
        click: () => {
          this.eventBus.on("open-menu-image", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off open-menu-image",
        click: () => {
          this.eventBus.off("open-menu-image", this.eventBusLog);
        }
      }, {
        icon: "iconSelect",
        label: "On open-menu-av",
        click: () => {
          this.eventBus.on("open-menu-av", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off open-menu-av",
        click: () => {
          this.eventBus.off("open-menu-av", this.eventBusLog);
        }
      }, {
        icon: "iconSelect",
        label: "On open-menu-content",
        click: () => {
          this.eventBus.on("open-menu-content", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off open-menu-content",
        click: () => {
          this.eventBus.off("open-menu-content", this.eventBusLog);
        }
      }, {
        icon: "iconSelect",
        label: "On open-menu-breadcrumbmore",
        click: () => {
          this.eventBus.on("open-menu-breadcrumbmore", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off open-menu-breadcrumbmore",
        click: () => {
          this.eventBus.off("open-menu-breadcrumbmore", this.eventBusLog);
        }
      }, {
        icon: "iconSelect",
        label: "On input-search",
        click: () => {
          this.eventBus.on("input-search", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off input-search",
        click: () => {
          this.eventBus.off("input-search", this.eventBusLog);
        }
      }, {
        icon: "iconSelect",
        label: "On paste",
        click: () => {
          this.eventBus.on("paste", this.eventBusPaste);
        }
      }, {
        icon: "iconClose",
        label: "Off paste",
        click: () => {
          this.eventBus.off("paste", this.eventBusPaste);
        }
      }, {
        icon: "iconSelect",
        label: "On open-siyuan-url-plugin",
        click: () => {
          this.eventBus.on("open-siyuan-url-plugin", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off open-siyuan-url-plugin",
        click: () => {
          this.eventBus.off("open-siyuan-url-plugin", this.eventBusLog);
        }
      }, {
        icon: "iconSelect",
        label: "On open-siyuan-url-block",
        click: () => {
          this.eventBus.on("open-siyuan-url-block", this.eventBusLog);
        }
      }, {
        icon: "iconClose",
        label: "Off open-siyuan-url-block",
        click: () => {
          this.eventBus.off("open-siyuan-url-block", this.eventBusLog);
        }
      }]
    });
    menu.addSeparator();
    menu.addItem({
      icon: "iconSettings",
      label: "Official Setting Dialog",
      click: () => {
        this.openSetting();
      }
    });
    menu.addItem({
      icon: "iconSettings",
      label: "A custom setting dialog (by svelte)",
      click: () => {
        this.openDIYSetting();
      }
    });
    menu.addItem({
      icon: "iconSparkles",
      label: this.data[STORAGE_NAME].readonlyText || "Readonly",
      type: "readonly"
    });
    if (this.isMobile) {
      menu.fullscreen();
    } else {
      menu.open({
        x: rect.right,
        y: rect.bottom,
        isLeft: true
      });
    }
  }
}
module.exports = PluginSample;
