import pop from "./selector/PpPopover";
import {axiosInstance as axios} from "../plugins/axios";
import {ajax_search_user} from "../api/user/user_info_api";
import {getFavoriteUsers, setFavoriteUser} from "../utils/favorite_user_selection";
import {formatDate} from "quasar-framework/src/utils/date";
// import DatePicker from "./datePicker/DatePicker";
// import DatePickerRanged from "./datePicker/DatePickerRanged";
import {Optional} from "../utils/Optional";
import extend from "quasar-framework/src/utils/extend";

const common_mixin = {
  props: {
    value: [Number, String, Object, Array],
    disable: Boolean,
    clear: Boolean
  }
};

export const radio_btn = {
  name: 'GenericFormUIRadioBtn',
  mixins: [common_mixin],
  props: {dictionary: Object},
  methods: {
    render_radio(h, key) {
      return h('q-radio', {
        staticClass: 'no-ripple',
        props: {value: this.value, val: key, label: this.dictionary[key]},
        on: {input: v => this.$emit('input', v)}
      })
    }
  },
  render(h) {
    return this.dictionary
      ? h('div', {staticClass: 'column no-wrap'}, Object.keys(this.dictionary).map(k => this.render_radio(h, k)))
      : null
  }
};

export const checkbox_btn = {
  name: 'GenericFormUICheckBoxBtn',
  mixins: [common_mixin],
  props: {dictionary: Object},
  computed: {
    fake_value() {
      return this.value || []
    }
  },
  methods: {
    render_radio(h, key) {
      return h('q-checkbox', {
        staticClass: 'no-ripple',
        props: {value: this.fake_value, val: key, label: this.dictionary[key]},
        on: {input: v => this.$emit('input', v)}
      })
    }
  },
  render(h) {
    return this.dictionary
      ? h('div', {staticClass: 'column no-wrap'}, Object.keys(this.dictionary).map(k => this.render_radio(h, k)))
      : null
  }
};


export const radio_selector = {
  name: 'GenericFormUIRadioSelector',
  mixins: [common_mixin],
  props: {dictionary: Object, key_map: String, label_map: String},
  computed: {
    fake_options() {
      return Object.keys(this.dictionary || {})
    }
  },
  methods: {
    render_option(h, option) {
      let selected = !this.value ? false
        : this.key_map ? this.value[this.key_map].toString() === option.toString()
          : this.value.toString() === option.toString();

      return h('q-btn', {
        staticClass: 'no-ripple',
        style: {fontSize: '13px', padding: '0 8px', marginRight: '4px'},
        props: {
          flat: true,
          label: this.dictionary ? this.dictionary[option] : '',
          color: selected ? 'primary' : 'grey',
          disable: this.disable
        },
        on: {
          click: () => this.$emit('input', this.key_map
            ? {[this.key_map]: option, [this.label_map]: this.dictionary[option]}
            : option
          )
        }
      })
    }
  },
  render(h) {
    return h('div', {}, this.fake_options.map(o => this.render_option(h, o)))
  }
};


export const number_input = {
  name: 'GenericFormUINumberInput',
  mixins: [common_mixin],
  props: {
    key_map: String,
    decimal: {type: [String, Number], default: 1, validator: v => v >= 0},
    placeholder: {type: String, default: '待输入'},
    active_class_list: Array,
    retire_class_list: Array,
  },
  computed: {
    fake_value() {
      return !this.value ? ''
        : !this.key_map ? this.value
          : typeof this.value[this.key_map] === 'number' ? this.value[this.key_map].toString()
            : this.value[this.key_map]
    }
  },
  watch: {
    fake_value(v) {
      this.$refs.input.value !== v && (this.$refs.input.value = v)
    }
  },
  methods: {
    input(e) {
      let pos = this.$refs.input.selectionStart;
      let last = this.fake_value || '';
      let value = e.target.value;

      let final_content;
      if (this.decimal > 0) {
        if (value.startsWith('.')) {
          final_content = value.replace('.', '0.');
          pos += 1;
        } else if ('' === value) {
          final_content = value
        } else if (new RegExp(`^[\\d]+(\\.[\\d]{0,${this.decimal}}|[\\d]*)$`).test(value)) {
          final_content = value;
        } else {
          final_content = last;
          pos -= 1;
        }
        e.target.value = final_content;

      } else if (this.decimal === 0) {
        if (/^[\d]+$/.test(value)) {
          final_content = value;
        } else if (value === '') {
          final_content = null;
        } else {
          pos -= 1;
          final_content = last;
        }
        e.target.value = final_content;
      }
      this.select(final_content);
      this.$refs.input.setSelectionRange(pos, pos)
    },
    select(v) {
      this.$emit('input', this.key_map ? {[this.key_map]: v} : v)
    }
  },
  render(h) {
    return h('div', {staticClass: 'q-input pp-radius flex items-center '}, [
      h('div', {staticClass: 'flex no-wrap items-center col-grow', style: {height: '24px'}}, [
        h('input', {
          staticClass: 'no-border full-width bg-transparent',
          style: {outline: 0},
          ref: 'input',
          attrs: {type: 'text', placeholder: this.placeholder, disabled: this.disable},
          on: {
            input: this.input,
            focus: e => {
              this.retire_class_list && this.$nextTick(() => this.$el.classList.remove(...this.retire_class_list));
              this.active_class_list && this.$nextTick(() => this.$el.classList.add(...this.active_class_list));
              this.$emit('focus', e)
            },
            blur: e => {
              this.active_class_list && this.$nextTick(() => this.$el.classList.remove(...this.active_class_list));
              this.retire_class_list && this.$nextTick(() => this.$el.classList.add(...this.retire_class_list));
              this.$emit('blur', e)
            },
          }
        }),
        this.$slots.after
      ])
    ])
  }
};


export const str_input = {
  name: 'GenericFormUIStrInput',
  mixins: [common_mixin],
  props: {
    type: {type: String, default: 'text', validator: v => ['text', 'textarea'].includes(v)},
    key_map: String,
    placeholder: {default: '待输入'},
    active_class_list: Array,
    retire_class_list: Array,
    output_mode: {type: String, default: 'sync', validator: v => ['sync', 'lazy', 'enter'].includes(v)},
    before: {type: Array, default: () => ([])},
    after: {type: Array, default: () => ([])},
    minWidth: String,
  },
  data: () => ({keep_value: '', lazy_timer: null}),
  watch: {
    value(v) {
      this.keep_value = v;
    }
  },
  mounted() {
    this.keep_value = this.value;
  },
  activated() {
    this.keep_value = this.value;
  },
  computed: {
    fake_value() {
      return this.key_map ? ((this.value || {})[this.key_map] || '') : (this.value || '')
    },
    enter_mode() {
      return this.output_mode === 'enter'
    }
  },
  methods: {
    input(v) {
      this.keep_value = v;
      if (this.output_mode === 'sync')
        this.emit();
      else if (this.output_mode === 'lazy') {
        this.lazy_timer && clearTimeout(this.lazy_timer);
        this.lazy_timer = setTimeout(() => {
          this.lazy_timer = null;
          this.emit()
        }, 200);
      }
    },
    emit() {
      this.$emit('input', this.key_map ? {[this.key_map]: this.keep_value} : this.keep_value)
    },
    focus() {
      this.$refs.input && this.$refs.input.focus();
    }
  },
  render(h) {
    let clear_btn = this.clear && this.keep_value
      ? [{
        icon: 'cancel',
        handler: () => {
          this.keep_value = null;
          this.emit();
          this.$refs.input.clear()
        }
      }]
      : [];
    let enter_btn = this.enter_mode ? [{icon: 'keyboard_return', handler: this.emit}] : [];
    return h('q-input', {
      style: {minWidth: this.minWidth},
      props: {
        color: 'primary',
        type: this.type,
        value: this.fake_value,
        placeholder: this.placeholder,
        hideUnderline: true,
        disable: this.disable,
        clearable: false,
        maxHeight: 150,
        before: this.before,
        after: [
          ...clear_btn,
          ...enter_btn,
          ...this.after
        ]
      },
      ref: 'input',
      on: {
        input: this.input,
        focus: e => {
          this.retire_class_list && this.$nextTick(() => this.$refs.input.$el.classList.remove(...this.retire_class_list));
          this.active_class_list && this.$nextTick(() => this.$refs.input.$el.classList.add(...this.active_class_list));
          this.$emit('focus', e)
        },
        blur: e => {
          this.active_class_list && this.$nextTick(() => this.$refs.input.$el.classList.remove(...this.active_class_list));
          this.retire_class_list && this.$nextTick(() => this.$refs.input.$el.classList.add(...this.retire_class_list));
          this.$emit('blur', e)
        },
        keyup: (e) => {
          if (this.enter_mode && e.key === 'Enter') {
            this.emit();
            this.$refs.input.blur()
          }
          this.$emit('keyup', e)
        }
      }
    }, [
      this.$scopedSlots.default ? this.$scopedSlots.default(this.fake_value, h) : null
    ])
  }
};

export const str_input_popup = {
  name: 'GenericFormUIStrInputPopup',
  mixins: [common_mixin],
  props: {
    placeholder: {default: '待输入'},
    active_class_list: Array,
    retire_class_list: Array,
    popup_offset: {type: Array, default: () => ([0, 1])},
    popup_from_top: Boolean
  },
  data: () => ({active: false}),
  methods: {
    _render_field_content(h) {
      return this.$scopedSlots.field_content ? this.$scopedSlots.field_content(this.value, h)
        : this.is_empty ? this._render_field_placeholder(h)
          : this.render_field_content(h)
    },
    _render_field_placeholder(h) {
      return h('span', {staticClass: 'text-placeholder'}, this.placeholder)
    },
    render_field_content(h) {
      return h('div', this.value)
    },
    _render_list(h) {
      return h('q-input', {
        staticClass: 'shadow-0 pp-border pp-radius bg-white q-mt-sm q-ml-sm q-mr-sm',
        style: {padding: '2px', minWidth: '260px'},
        props: {
          value: this.fake_value,
          placeholder: '按标题关键字查找...',
          hideUnderline: true,
          color: 'primary',
          clearable: this.clear,
          disable: this.disable,
          before: [{icon: 'search'}],
        },
        on: {input: v => this.fake_value = v},
        nativeOn: {keydown: e => e.key === 'Enter' && this._select(this.fake_value)},
        ref: 'focus'
      })
    },
    _render_list_confirm(h) {
      return h('div', {staticClass: 'q-mt-sm row reverse q-mb-xs q-mr-sm'}, [
        h('q-btn', {
          style: {fontSize: '13px'},
          props: {label: '确定', flat: true, size: 'md', color: 'primary'},
          on: {click: () => this._select(this.fake_value || {})}
        })
      ])
    },
    _select(value) {
      this.$emit('input', value);
      this.$refs.popup.hide()
    },
    _show() {
      this.fake_value = this.value;
      this.$refs.focus && this.$refs.focus.focus();
    },
    _hide() {

    }
  },
  render(h) {
    return h('div', {
      staticClass: 'pjm-selector flex no-wrap items-center',
      'class': {'active': this.active, 'cursor-not-allowed': this.disable, 'cursor-pointer': !this.disable}
    }, [
      this._render_field_content(h),
      h(pop, {
        staticClass: 'pjm-selector-popover',
        ref: 'popup',
        props: {
          value: this.active,
          fit: false,
          disable: this.disable,
          offset: this.popup_offset,
          active_class_list: this.active_class_list,
          retire_class_list: this.retire_class_list,
          anchor: this.popup_from_top ? 'top left' : 'bottom left',
          self: this.popup_from_top ? 'top left' : 'top left'
        },
        on: {show: this._show, hide: this._hide, input: v => this.active = v}
      }, [
        this._render_list(h),
        this._render_list_confirm(h)
      ])
    ])
  }
};


export const user_selector = {
  name: 'GenericFormUIUserSelector',
  mixins: [common_mixin],
  props: {
    placeholder: {default: '待选择'},
    multiple: {type: Boolean, default: true},
    confirm: Boolean,
    key_map: {type: String, default: 'account'},
    label_map: {type: String, default: 'name'},
    key_trans: {type: String, default: 'account'},
    label_trans: {type: String, default: 'name'},
    retire_class_list: Array,
    active_class_list: Array,
    popup_offset: Array,
    popup_from_top: Boolean,
    include_group: Boolean,
    filter_out_account: Array,
    auto_hide: {type: Boolean, default: true}
  },
  data: () => ({user_list: [], kw: ''}),
  computed: {
    filter_user_list() {
      let res = this.user_list;
      res = this.filter_out_account && this.filter_out_account.length ? res.filter(u => !this.filter_out_account.includes(u.account)) : res;
      return res;
    }
  },
  methods: {
    request_user() {
      this.kw && ajax_search_user(this.kw).then(d => this.user_list = d.data).catch(() => this.$q.err('查找用户异常'));
      this.kw || (this.user_list = getFavoriteUsers(5))
    },
  },
  render(h) {
    return h(generic_selector, {
      props: {
        value: this.value,
        disable: this.disable,
        clear: this.clear,
        placeholder: this.placeholder,
        multiple: this.multiple,
        confirm: this.confirm,
        static_options: this.filter_user_list,
        key_map: this.key_map,
        label_map: this.label_map,
        key_trans: this.key_trans,
        label_trans: this.label_trans,
        retire_class_list: this.retire_class_list,
        active_class_list: this.active_class_list,
        popup_offset: this.popup_offset,
        popup_from_top: this.popup_from_top,
        auto_hide: this.auto_hide,
        select_all: false
      },
      on: {
        show: () => {
          this.kw = null;
          this.$refs.input.focus();
          this.request_user();
        },
        input: v => {
          this.$emit('input', v);
          setFavoriteUser(v);
        }
      },
      scopedSlots: {
        ...this.$scopedSlots,
        list_top: () => h(str_input, {
          staticClass: 'q-ma-xs bg-white',
          props: {value: this.kw, placeholder: '通过关键字查找', output_mode: 'lazy', before: [{icon: 'search'}]},
          on: {
            input: v => {
              this.kw = v;
              this.request_user()
            },
            focus: e => {
              this.kw = '';
              this.request_user()
            }
          },
          ref: 'input'
        }),
        option: op => h('div', {staticClass: 'flex no-wrap items-center q-px-xs'},
          [
            h('i', {
              staticClass: 'material-icons text-faded pp-radius font-16 q-mr-xs',
            }, 'person'),
            h('div', op.name),
            h('div', {staticClass: 'q-ml-xs'}, op.account),
          ]
        )
      }
    })
  }
};

export const generic_selector = {
  name: 'GenericFormUIGenericSelector',
  mixins: [common_mixin],
  props: {
    placeholder: {default: '待选择'},
    multiple: Boolean,
    confirm: Boolean,
    filter: Boolean,
    static_options: Array,
    grouping_func: Function,
    grouping_by: String,
    grouping_key: String,
    key_map: String,
    label_map: String,
    key_trans: String,
    label_trans: String,
    query: Object,
    query_func: Function,
    query_response_trans_func: Function,
    query_err_msg: {type: String, default: '查询异常'},
    active_class_list: Array,
    retire_class_list: Array,
    popup_offset: {type: Array, default: () => ([0, 1])},
    popup_from_top: Boolean,
    maxHeight: {type: String, default: '350px'},
    anchor: String,
    self: String,
    auto_hide: {type: Boolean, default: true},
    select_all: {type: Boolean, default: true}
  },
  data: () => ({query_options: [], filter_kw: '', active: false}),
  computed: {
    fake_value() {
      return (this.value ? JSON.parse(JSON.stringify(this.value)) : this.value) || [];
    },
    fake_options() {
      let arr = (this.static_options ? this.static_options : this.query_options) || [];

      !Array.isArray(arr) && (arr = this.query_options.data)

      arr = arr.map(i => {
        this.key_trans && (this.key_trans !== this.key_map) && (i[this.key_map] = i[this.key_trans]);
        this.label_trans && (this.label_trans !== this.label_map) && (i[this.label_map] = i[this.label_trans]);
        return i;
      });

      if (this.filter && this.filter_kw)
        arr = arr.filter(i => i[this.label_map].includes(this.filter_kw));

      return arr;
    },
    grouping() {
      return this.grouping_by || this.grouping_func
    },
    grouped_fake_options() {
      let res = {};

      this.grouping && this.fake_options.forEach(op => {
        let gBy = this.grouping_by ? op[this.grouping_by] : this.grouping_func ? this.grouping_func(op) : null;
        gBy = gBy ? gBy : this.grouping_key ? {[this.grouping_key]: 'no_group'} : 'no_group';
        let gKey = this.grouping_key ? gBy[this.grouping_key] : gBy;

        let tmp = res[gKey] || {by: gBy, options: []};
        tmp.options.push(op);
        res[gKey] = tmp;
      });

      return res;
    },
    is_empty() {
      return !this.value || (this.value instanceof Array && this.value.length === 0)
    },
  },
  methods: {
    _render_field_content(h, value) {
      return this.$scopedSlots.field_content ? this.$scopedSlots.field_content(value, h)
        : this.is_empty ? this._render_field_placeholder(h)
          : this.multiple ? this._render_field_mu(h, value)
            : this._render_field(h, value)
    },
    _render_field_mu(h, value) {
      value = value || [];
      return h('div', {staticClass: 'flex'}, value.map(v => h('div', {staticClass: 'flex no-wrap items-center'}, [
          h('q-checkbox', {
            staticClass: 'no-ripple',
            props: {value: true},
            on: {input: () => this._select(value.filter(i => !this._is_same(i, v)))}
          }),
          this._render_field(h, v)
        ]
      )))
    },
    _render_field(h, value) {
      return this.$scopedSlots.field ? this.$scopedSlots.field(value, h) : this.render_field(h, value)
    },
    render_field(h, value) {
      return h('div', {staticClass: 'pp-sentence'}, [this.label_map ? value[this.label_map] : value])
    },
    _render_field_placeholder(h) {
      return h('div', {staticClass: 'text-placeholder'}, this.placeholder)
    },
    _render_field_prefix(h, value) {
      return this.$scopedSlots.field_prefix ? this.$scopedSlots.field_prefix(value) : this.render_field_prefix(h, value)
    },
    render_field_prefix(h, value) {
    },
    _render_field_suffix(h, value) {
      return this.$scopedSlots.field_suffix ? this.$scopedSlots.field_suffix(value) : null
    },
    _render_field_clear(h, value) {
      return h('pp-clear', {
        props: {size: 'xs', hide: !this.clear || this.multiple || this.is_empty, disable: this.disable},
        on: {
          click: e => {
            e.stopPropagation();
            this._select(null)
          }
        }
      })
    },
    _render_field_end(h, value) {
      return this.$scopedSlots.field_end ? this.$scopedSlots.field_end(value) : null
    },
    _render_grouped_list(h) {
      let grouped_fake_options = this.grouped_fake_options;
      let gKeys = Object.keys(grouped_fake_options);
      return !gKeys.length ? this._render_no_options(h) : gKeys.map(gKey => {
        let group = grouped_fake_options[gKey];
        return this._render_grouped_sections(h, group)
      })
    },
    _render_grouped_sections(h, group) {
      if (this.$scopedSlots.group_section)
        return this.$scopedSlots.group_section(group);

      let head = null;
      if (this.multiple && this.select_all) {
        let fv_keys = this.fake_value.map(v => this.key_map ? v[this.key_map] : v);
        let not_selected = group.options.filter(op => !fv_keys.includes(this.key_map ? op[this.key_map] : op));

        head = h('q-checkbox', {
          staticClass: 'no-ripple bg-grey-3 full-width pp-selectable-bg',
          style: {minHeight: '20px', lineHeight: '20px'},
          props: {value: !not_selected.length ? true : not_selected.length === group.options.length ? false : null},
          on: {
            input: v => {
              if (v) {
                not_selected.forEach(op => this.fake_value.push(op))
              } else {
                group.options.map(op => this.key_map ? op[this.key_map] : op).forEach(k => {
                  let i = fv_keys.indexOf(k);
                  this.fake_value.splice(i, 1);
                  fv_keys.splice(i, 1)
                })
              }
              this.confirm ? this.$forceUpdate() : this._select(this.fake_value)
            }
          }
        }, [
          this.$scopedSlots.group_by ? this.$scopedSlots.group_by(group.by, h) : h('div', group.by)
        ])
      } else {
        head = this.$scopedSlots.group_by ? this.$scopedSlots.group_by(group.by, h) : h('div', {staticClass: 'text-bold'}, group.by)
      }

      return [
        head,
        this._render_list(h, group.options)
      ]
    },
    _render_list(h, options) {
      return this.$scopedSlots.list ? this.$scopedSlots.list(options, h)
        : !options.length ? this._render_no_options(h)
          : this.multiple ? this._render_list_content_mu(h, options)
            : this._render_list_content_sg(h, options)
    },
    _render_no_options(h) {
      return h('span', {staticClass: 'text-faded q-ml-xs q-mr-xs'}, '无数据')
    },
    _render_list_content_mu(h, options) {
      let disable = options.disable;
      let extra_node = null;
      if (this.select_all && !this.grouping) {
        let select_all_value = !this.fake_value.length ? false : this.fake_value.length === options.length ? true : null;
        extra_node = [
          h('q-checkbox', {
            staticClass: 'no-ripple pp-selectable-bg text-bold',
            style: {minHeight: '20px', lineHeight: '20px'},
            props: {value: select_all_value},
            on: {
              input: v => {
                this.fake_value.splice(0, this.fake_value.length);
                v && options.forEach(op => this.fake_value.push(op));
                this.confirm ? this.$forceUpdate() : this._select(this.fake_value)
              }
            }
          }, [
            h('div', {staticClass: 'q-px-xs'}, '全部选择')
          ]),
          h('div', {staticClass: 'bg-grey-3 q-my-xs', style: {height: '1px', flexShrink: 0}})
        ]
      }

      return h('div', {staticClass: 'q-pt-xs q-pb-xs column no-wrap'}, [
        extra_node,
        options.map(op => {
            return h('q-checkbox', {
              staticClass: 'no-ripple q-pr-xs pp-selectable-bg',
              style: {minHeight: '20px', lineHeight: '20px'},
              props: {value: this._index_of(this.fake_value, op) >= 0, disable},
              on: {
                input: v => {
                  v ? this.fake_value.push(op) : this.fake_value.splice(this._index_of(this.fake_value, op), 1);
                  this.confirm ? this.$forceUpdate() : this._select(this.fake_value)
                }
              }
            }, [
              this._render_list_option(h, op)
            ])
          }
        )
      ])
    },
    _render_list_content_sg(h, options) {
      return h('div', {staticClass: 'q-pt-xs q-pb-xs column no-wrap'}, options.map(op => {
        let disable = op.disable;
        let conf = this._is_same(this.fake_value, op) ? {staticClass: 'pp-selected-bg'}
          : disable ? {staticClass: 'cursor-not-allowed text-light'}
            : {
              staticClass: 'cursor-pointer pp-selectable-bg',
              on: {
                click: () => {
                  this._select(op);
                  this.auto_hide && this.$refs.popup.hide()
                }
              }
            };
        return h('div', {
          ...conf,
          style: {minHeight: '20px', lineHeight: '20px'}
        }, [this._render_list_option(h, op, disable)])
      }))
    },
    _render_list_option(h, op) {
      return this.$scopedSlots.option ? this.$scopedSlots.option(op, h) : this.render_list_option(h, op)
    },
    render_list_option(h, value) {
      return h('div', {
        staticClass: 'q-pl-xs q-pr-xs ellipsis',
        style: {minWidth: '60px'}
      }, [this.label_map ? value[this.label_map] : value])
    },
    _render_list_top(h, options) {
      return this.$scopedSlots.list_top ? this.$scopedSlots.list_top(options, h) : this.render_list_top(h, options)
    },
    render_list_top(h, options) {
      if (this.filter)
        return h(str_input, {
          staticClass: 'q-ma-xs bg-white',
          style: {flexShrink: 0},
          props: {value: this.filter_kw, placeholder: '通过关键字查找', before: [{icon: 'filter_list'}]},
          on: {
            input: v => this.filter_kw = v,
            focus: e => this.filter_kw = ''
          },
          ref: 'input'
        })
    },
    _render_list_bottom(h, options) {
      return this.$scopedSlots.list_bottom ? this.$scopedSlots.list_bottom(options, h) : this.render_list_bottom(h, options)
    },
    render_list_bottom(h, options) {
    },
    _render_list_confirm(h, options) {
      if (this.confirm && this.multiple && options.length > 0)
        return h('div', {
          staticClass: 'font-13 non-selectable text-white text-weight-medium bg-blue-6 full-width text-center cursor-pointer pp-selectable-bg-blue-4',
          style: {height: '19px', lineHeight: '19px', borderTop: '1px solid var(--q-color-grey-4)'},
          on: {
            click: () => {
              this._select(this.fake_value || {});
              this.$refs.popup.hide()
            }
          }
        }, '确定')
    },
    _is_same(l, r) {
      if (l && r) {
        if (this.key_map) {
          if (l[this.key_map] && r[this.key_map]) {
            return l[this.key_map].toString() === r[this.key_map].toString()
          }
        } else {
          return l === r
        }
      }
      return false
    },
    _index_of(arr, el) {
      return this.key_map ? arr.map(a => a[this.key_map]).indexOf(el[this.key_map]) : arr.indexOf(el)
    },
    _select(value) {
      this.$emit('input', value);
    },
    _show() {
      this.filter_kw = '';
      this.request();
      this.show();
      this.$emit('show');
      this.$refs.input && this.$refs.input.focus();
    },
    request() {
      let pm;
      if (this.query && this.query.url)
        pm = axios.request(this.query);
      if (this.query_func)
        pm = this.query_func();

      pm && pm.then(d => this.query_options = this.query_response_trans_func ? this.query_response_trans_func(d) : d).catch(() => this.$q.err(this.err_msg))
    },
    show() {
    },
    _hide() {
      this.hide();
      this.$emit('hide')
    },
    hide() {
    }
  },

  render(h) {
    return h('div', {
      staticClass: 'pjm-selector flex items-center no-wrap',
      'class': {'active': this.active, 'cursor-not-allowed': this.disable, 'cursor-pointer': !this.disable},
      style: {minWidth: 0}
    }, [
      this._render_field_prefix(h, this.value),
      this._render_field_content(h, this.value),
      this._render_field_suffix(h, this.value),
      h('div', {staticClass: 'col-grow'}),
      this._render_field_clear(h, this.value),
      this._render_field_end(h, this.value),
      h(pop, {
        staticClass: 'pjm-selector-popover column no-wrap',
        style: {overflow: 'hidden'},
        ref: 'popup',
        props: {
          value: this.active,
          fit: true,
          disable: this.disable,
          offset: this.popup_offset,
          active_class_list: this.active_class_list,
          retire_class_list: this.retire_class_list,
          anchor: this.anchor ? this.anchor : this.popup_from_top ? 'top left' : 'bottom left',
          self: this.self ? this.self : this.popup_from_top ? 'top left' : 'top left',
          maxHeight: this.maxHeight
        },
        on: {
          show: this._show, hide: this._hide, input: v => this.active = v
        }
      }, [
        this._render_list_top(h, this.fake_options),
        h('div', {staticClass: 'col-grow  scroll'}, [
          this.grouping ? this._render_grouped_list(h) : this._render_list(h, this.fake_options)
        ]),
        this._render_list_bottom(h, this.fake_options),
        this._render_list_confirm(h, this.fake_options)
      ])
    ])
  }
};

export const date_selector = {
  name: 'GenericFormUIDateSelector',
  mixins: [common_mixin],
  props: {
    min: [String, Number, Date],
    max: [String, Number, Date],
    valid: Function,
    placeholder: {default: '待选择'},
    key_map: String,
    conf_time: Boolean,
    confirm: Boolean,
    end_of_day: Boolean,
    active_class_list: Array,
    retire_class_list: Array,
    popup_offset: {type: Array, default: () => ([0, 1])},
    popup_from_top: Boolean
  },
  data: () => ({fake_value: null, active: false}),
  computed: {
    dateFormat() {
      return this.conf_time ? 'YYYY年MM月DD日 HH:mm' : 'YYYY年MM月DD日'
    },
    is_empty() {
      return !this._parse_time(this.value)
    }
  },
  methods: {
    _parse_time(value) {
      return !value ? value : this.key_map ? value[this.key_map] : value
    },
    _decorate_time(value) {
      return !value ? value : this.key_map ? {[this.key_map]: value} : value
    },
    _render_field_content(h) {
      return this.$scopedSlots.field_content ? this.$scopedSlots.field_content(this.value, h)
        : this.is_empty ? this._render_field_placeholder(h)
          : this.render_field_content(h)
    },
    render_field_content(h) {
      return h('div', {staticClass: 'flex no-wrap items-center'}, [formatDate(this._parse_time(this.value), this.dateFormat)])
    },
    _render_field_clear(h, value) {
      return h('pp-clear', {
        props: {size: 'xs', hide: !this.clear || this.is_empty, disable: this.disable},
        on: {
          click: e => {
            e.stopPropagation();
            this._select(null);
          }
        }
      })
    },
    _render_field_end(h, value) {
      return this.$scopedSlots.field_end ? this.$scopedSlots.field_end(value) : null
    },
    _render_list(h) {
      return h('div', {staticClass: 'q-pt-xs q-pb-xs'}, [
        h(DatePicker, {
          props: {
            value: this._parse_time(this.fake_value),
            min: this.min,
            max: this.max,
            valid: this.valid,
            conf_time: this.conf_time
          },
          ref: 'DatePicker',
          on: {
            input: v => {
              this.fake_value = this._decorate_time(v);
              this.confirm || this._select(this.fake_value);
              this.confirm || this.conf_time || this.$refs.popup.hide()
            }
          }
        })
      ])
    },
    _render_field_placeholder(h) {
      return h('span', {staticClass: 'text-placeholder'}, this.placeholder)
    },
    _render_list_confirm(h) {
      if (this.confirm)
        return h('div', {
          staticClass: 'font-13 non-selectable text-white text-weight-medium bg-blue-6 full-width text-center cursor-pointer pp-selectable-bg-blue-4',
          style: {height: '20px', lineHeight: '20px', borderTop: '1px solid var(--q-color-grey-4)'},
          on: {
            click: () => {
              this._select(this.fake_value || {});
              this.$refs.popup.hide()
            }
          }
        }, '确定')
    },
    _show() {
      this.fake_value = this.value ? JSON.parse(JSON.stringify(this.value)) : this.value
    },
    _hide() {
      this.$refs.DatePicker.viewYearHold = this.$refs.DatePicker.viewMonthHold = null
    },
    _select(value) {
      if (this.end_of_day && !this.conf_time) {
        let v = this._parse_time(value);
        if (v) {
          v = new Date(v);
          v.setHours(23);
          v.setMinutes(59);
          v.setSeconds(59);
          v = this._decorate_time(v.getTime())
        }
        this.$emit('input', v);
      } else
        this.$emit('input', value);
    },
  },
  render(h) {
    return h('div', {
      staticClass: 'pjm-selector flex no-wrap items-center',
      'class': {'active': this.active, 'cursor-not-allowed': this.disable, 'cursor-pointer': !this.disable}
    }, [
      this._render_field_content(h),
      h('div', {staticClass: 'col-grow'}),
      this._render_field_clear(h),
      this._render_field_end(h, this.value),
      h(pop, {
        staticClass: 'pjm-selector-popover',
        ref: 'popup',
        props: {
          value: this.active,
          fit: false,
          disable: this.disable,
          offset: this.popup_offset,
          active_class_list: this.active_class_list,
          retire_class_list: this.retire_class_list,
          anchor: this.popup_from_top ? 'top left' : 'bottom left',
          self: this.popup_from_top ? 'top left' : 'top left'
        },
        on: {show: this._show, hide: this._hide, input: v => this.active = v}
      }, [
        this._render_list(h, this.fake_options),
        this._render_list_confirm(h, this.fake_options)
      ])
    ])
  }

};

export const date_selector_dc = {
  name: 'GenericFormUIDateSelectorDc',
  mixins: [common_mixin],
  props: {
    min: [String, Number, Date],
    max: [String, Number, Date],
    placeholder: {default: '待选择'},
    active_class_list: Array,
    retire_class_list: Array,
    popup_offset: {type: Array, default: () => ([0, 1])},
    popup_from_top: Boolean
  },
  data: () => ({fake_value: {f: null, t: null}, dateFormat: 'YYYY/MM/DD', active: false}),
  computed: {
    start_value() {
      return Optional.ofNullable(this.value).map(v => v.f).orElse(null);
    },
    end_value() {
      return Optional.ofNullable(this.value).map(v => v.t).orElse(null)
    },
    is_empty() {
      return !this.start_value && !this.end_value
    }
  },
  methods: {
    _render_field_content(h) {
      return this.$scopedSlots.field_content ? this.$scopedSlots.field_content(this.value, h)
        : this.is_empty ? this._render_field_placeholder(h)
          : this.render_field_content(h)
    },
    _render_field_placeholder(h) {
      return h('span', {staticClass: 'text-placeholder'}, this.placeholder)
    },
    render_field_content(h) {
      return h('div', {staticClass: 'flex no-wrap items-center'}, [
        this.start_value ? formatDate(this.start_value, this.dateFormat) : '',
        ' - ',
        this.end_value ? formatDate(this.end_value, this.dateFormat) : '',
      ])
    },
    _render_field_clear(h) {
      return h('pp-clear', {
        props: {size: 'xs', hide: !this.clear || this.is_empty, disable: this.disable},
        on: {
          click: e => {
            e.stopPropagation();
            this._select({});
          }
        }
      })
    },
    _render_field_end(h, value) {
      return this.$scopedSlots.field_end ? this.$scopedSlots.field_end(value) : null
    },
    _render_list(h) {
      return h('div', {staticClass: 'col-grow'}, [
        h(DatePickerRanged, {
          props: {
            start: this.fake_value.f,
            end: this.fake_value.t,
            min: this.min,
            max: this.max,
            dateFormat: this.dateFormat
          },
          on: {
            'input:start': v => this.fake_value.f = v,
            'input:end': v => this.fake_value.t = v
          }
        })
      ])
    },
    _render_list_confirm(h) {
      return h('div', {
        staticClass: 'font-13 non-selectable text-white text-weight-medium bg-blue-6 full-width text-center cursor-pointer pp-selectable-bg-blue-4',
        style: {height: '20px', lineHeight: '20px', borderTop: '1px solid var(--q-color-grey-4)'},
        on: {
          click: () => {
            this._select(this.fake_value || {});
            this.$refs.popup.hide()
          }
        }
      }, '确定')
    },
    _show() {
      this.fake_value = extend(true, {f: null, t: null}, this.value)
    },
    _hide() {
    },
    _select(value) {
      this.$emit('input', value);
    },
  },
  render(h) {
    return h('div', {
      staticClass: 'pjm-selector flex no-wrap items-center',
      'class': {'active': this.active, 'cursor-not-allowed': this.disable, 'cursor-pointer': !this.disable}
    }, [
      this._render_field_content(h),
      h('div', {staticClass: 'col-grow'}),
      this._render_field_clear(h),
      this._render_field_end(h, this.value),
      h(pop, {
        staticClass: 'pjm-selector-popover column no-wrap',
        ref: 'popup',
        props: {
          value: this.active,
          fit: false,
          disable: this.disable,
          offset: this.popup_offset,
          active_class_list: this.active_class_list,
          retire_class_list: this.retire_class_list,
          anchor: this.popup_from_top ? 'top left' : 'bottom left',
          self: this.popup_from_top ? 'top left' : 'top left'
        },
        on: {show: this._show, hide: this._hide, input: v => this.active = v}
      }, [
        this._render_list(h),
        this._render_list_confirm(h)
      ])
    ])
  }
};

const bg_map = {
  primary: 'bg-blue-1',
  secondary: 'bg-teal-1',
  faded: 'bg-grey-3',
  light: 'bg-grey-2',
  negative: 'bg-red-1',
  warning: 'bg-amber-1'
};
export const generic_button = {
  name: 'genericButton',
  props: {
    loading: Boolean,
    disable: Boolean,
    label: [Number, String],
    noCaps: Boolean,
    icon: String,
    iconRight: String,
    size: String,
    color: {
      type: String,
      default: 'primary',
      validator: s => ['primary', 'secondary', 'faded', 'light', 'negative', 'warning'].includes(s)
    },
    textColor: String,
    dense: Boolean,
    noRipple: Boolean,
    tabindex: Number,
    tooltip: {type: String, default: null}
  },
  render(h) {
    return this.render_(h)
  },
  methods: {
    render_(h) {
      return h('q-btn', {
        staticClass: `pp-border-${this.color} ${bg_map[this.color]} font-13`,
        'class': {[` pp-selectable-color-white pp-selectable-bg-${this.color}`]: !this.disable},
        style: {paddingTop: 0, paddingBottom: 0},
        props: {...this.$props, flat: true, noWrap: true},
        on: this._events,
      }, [this.tooltip && h('q-tooltip', {props: {offset: [5, 5]}}, this.tooltip), this.$slots.default])
    }
  }
};


