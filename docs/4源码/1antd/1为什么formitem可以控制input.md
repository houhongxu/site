# 为什么 formitem 可以控制 input

> 源码版本 antd 5.0.0

在不使用受控模式组件时，formitem 可以控制 input

那么首先我们得先理解一下受控模式是什么

## 受控模式

受控模式的意思就是组件状态受到控制(react/vue)

当你传入 value 和 onChange 时，就属于受控模式

```tsx
<Input
  value={value}
  onChange={(e) => {
    setValue(e.target.value);
  }}
/>
```

我们通过阅读相关源码来尝试理解这个过程

首先看一下 input 的源码，里面包装了 rc-input，antd 大量使用了这种模式，阅读需要结合起来

input 内是维护了一个 innerValue 做一些额外的状态处理，本质上 value 和 oChange 还是传给了原生 input

这种方式我们开发中经常使用，只是源码中的更复杂一点

```tsx
import RcInput from "rc-input";

const Input = (props) => {
  const { onChange, ...rest } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // removePasswordTimeout();
    onChange?.(e);
  };

  // rest中有value，透传了value和onChange给原生input
  return <RcInput {...rest} onChange={handleChange} />;
};
```

然后我们看一下 rc-input

```tsx
import useMergedState from "@rc-component/util/lib/hooks/useMergedState";

const Input = (props) => {
  const { onChange, ...rest } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  // 外部value初始化为内部innerValue
  const [value, setValue] = useMergedState(props.defaultValue, {
    value: props.value,
  });

  const triggerChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.CompositionEvent<HTMLInputElement>,
    currentValue: string,
    info: ChangeEventInfo
  ) => {
    // currentValue就是原生e.target.value
    let cutValue = currentValue;

    // 赋值内部innerValue
    setValue(cutValue);

    // 调用外部onChange函数，值还是原生e.target.value
    if (inputRef.current) {
      resolveOnChange(inputRef.current, e, onChange, cutValue);
    }
  };

  const onInternalChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    triggerChange(e, e.target.value, {
      source: "change",
    });
  };

  return (
    <input
      // otherProps中包含value
      {...otherProps}
      // onChange使用onInternalChange函数封装
      onChange={onInternalChange}
      ref={inputRef}
    />
  );
};
```

其中 onChange 调用事件封装在了 resolveOnChange 函数

就是单纯的调用罢了

```tsx
export function resolveOnChange<
  E extends HTMLInputElement | HTMLTextAreaElement
>(
  target: E,
  e:
    | React.ChangeEvent<E>
    | React.MouseEvent<HTMLElement, MouseEvent>
    | React.CompositionEvent<HTMLElement>,
  onChange: undefined | ((event: React.ChangeEvent<E>) => void),
  targetValue?: string
) {
  if (!onChange) {
    return;
  }
  let event = e;

  if (e.type === "click") {
    // Clone a new target for event.
    // Avoid the following usage, the setQuery method gets the original value.
    //
    // const [query, setQuery] = React.useState('');
    // <Input
    //   allowClear
    //   value={query}
    //   onChange={(e)=> {
    //     setQuery((prevStatus) => e.target.value);
    //   }}
    // />

    event = cloneEvent(e, target, "");

    // 调用外部onChange函数，cloneEvent是为了触发react更新
    onChange(event as React.ChangeEvent<E>);
    return;
  }

  // 调用外部onChange函数
  onChange(event as React.ChangeEvent<E>);
}
```

所以忽略掉 innerValue 的话，value 和 onChange 就是直接用在原生 input 上

ref 也是，所以可以得出，非受控模式也是类似原生 input

## 非受控模式

非受控模式就是组件自己维护状态，比如由 dom

```tsx
// dom
const inputRef = useRef();

const handleSubmit = () => {
  const value = inputRef.current?.input?.value;
  console.log("提交的值:", value);
};

<div>
  <Input ref={inputRef} placeholder="请输入内容" />
  <button onClick={handleSubmit}>提交</button>
</div>;
```

可以看出来其实就是通过 inputRef 拿到了原生 input dom 来操作

## antdform 接管

antdform 控制 input 的方式也属于受控模式的应用，研究了上面的 input 实现，受控和非受控模式，对于理解接管就方便多了

首先看看 antd 官方文档的说明

"被设置了 name 属性的 Form.Item 包装的控件，表单控件会自动添加 value（或 valuePropName 指定的其他属性） onChange（或 trigger 指定的其他属性），数据同步将被 Form 接管"

简单来说，form 使用 context 维护所有组件的 value 和 onChange，你不再需要单独给每一个组件配置 value 和 onChange

改为使用 form.setFieldsValue、form.getFieldsValue、form.submit、onValuesChange 等统一处理 values

只要使用带有 name 属性的 formitem 包装组件就会触发

其中主要的逻辑从 formitem 开始，我们来看看它相关的源码

```tsx
function InternalFormItem<Values = any>(
  props: FormItemProps<Values>
): React.ReactElement {
  const { trigger = "onChange" } = props;

  return (
    <Field {...props} trigger={trigger}>
      {(control, renderMeta, context) => {
        // Filed返回control的参数，control里包含内部value和内部onChange函数
        const mergedControl: typeof control = {
          ...control,
        };

        if (isValidElement(children)) {
          const childProps = { ...children.props, ...mergedControl };

          // 这里其实就是['onChange']
          const triggers = new Set<string>([
            ...toArray(trigger),
            // ...toArray(mergedValidateTrigger),
          ]);

          // onChange事件重写为先调用mergedControl的onChange函数，再调用子元素的onChange函数，即先内部onChange，再外部onChange
          triggers.forEach((eventName) => {
            childProps[eventName] = (...args: any[]) => {
              mergedControl[eventName]?.(...args);
              children.props[eventName]?.(...args);
            };
          });

          // 克隆children并重新赋值props，重写的onChange函数就控制了children
          childNode = (
            <MemoInput
              value={mergedControl[props.valuePropName || "value"]}
              update={children}
              childProps={watchingChildProps}
            >
              {cloneElement(children, childProps)}
            </MemoInput>
          );
        }

        return renderLayout(childNode, fieldId, isRequired);
      }}
    </Field>
  );
}
const FormItem = InternalFormItem as FormItemInterface;
```

可以看到 formitem 是通过 cloneElement 将 children 的 props 重新赋值,主要是赋值的 control 对象，其中有内部的 value，还有重置了的 onChange 函数

重置的 onChange 函数先执行 form 内部的 onChange 维护 form 状态，再执行外部的 onChange

老样子，它也是包装了 rc-field-form Field 组件

control 对象就是 Field 提供的

最后再看一下 Field 就结束了

```tsx
function WrapperField({ name, ...restProps }) {
  // 获取fieldContext上下文
  const fieldContext = React.useContext(FieldContext);
  // 获取namePath
  const namePath = name !== undefined ? getNamePath(name) : undefined;

  <Field
    key={key}
    name={namePath}
    {...restProps}
    // 传递fieldContext上下文
    fieldContext={fieldContext}
  />;
}

export default WrapperField;
```

Field 其实导出的 WrapperField

WrapperField 主要是获取然后透传了 fieldContext，这个就是 form 通过 createContext 创建的的上下文，这次就不仔细看了

还有就是获取了 namePath，namePath 是用来获取 form values 具体哪个组件的值的路径，比如，组件 input.name=['inputData','value']

那输入 1 之后 form 的 values 就是`{inputData:{value:'1'}}`，namePath 就是['inputData','value']

如果 input.name 是'value'就是`{value:'1'}`和['value']

```tsx
class Field {
  public static contextType = FieldContext;

  public getValue = (store?: Store) => {
    // 通过form.getFieldsValue和namePath获取内部当前组件值
    const { getFieldsValue }: FormInstance = this.props.fieldContext;

    const namePath = this.getNamePath();

    return getValue(store || getFieldsValue(true), namePath);
  };

  public getControlled = (childProps: ChildProps = {}) => {
    const {
      name,
      // 触发的是外部onChange事件
      trigger = "onChange",
      // 绑定的是value
      valuePropName = "value",
      // 为子元素添加额外的属性
      getValueProps,
      // 获取fieldContext上下文
      fieldContext,
    } = this.props;

    const namePath = this.getNamePath();

    // 从上下文中获取getInternalHooks
    const { getInternalHooks, getFieldsValue }: InternalFormInstance =
      fieldContext;

    // 从getInternalHooks中获取dispatch，dispatch是更新内部value的函数
    const { dispatch } = getInternalHooks(HOOK_MARK);

    // 获内部取当前组件值
    const value = this.getValue();

    // 当前是后面的函数
    const mergedGetValueProps =
      getValueProps || ((val: StoreValue) => ({ [valuePropName]: val }));

    // 当前情况为空
    const originTriggerFunc = childProps[trigger];

    // 获取到内部value
    const valueProps = name !== undefined ? mergedGetValueProps(value) : {};

    const control = {
      // 包括内部onChange函数
      ...childProps,
      // 包括内部value
      ...valueProps,
    };

    // control.onChange函数使用FieldContext里的dispatch更新内部value
    // Add trigger
    control[trigger] = (...args: EventArgs) => {
      // Mark as touched

      let newValue: StoreValue;

      //更新内部value
      if (newValue !== value) {
        dispatch({
          type: "updateValue",
          namePath,
          value: newValue,
        });
      }

      // 当前情况不执行
      if (originTriggerFunc) {
        originTriggerFunc(...args);
      }
    };

    // Add validateTrigger
    const validateTriggerList: string[] = toArray(mergedValidateTrigger || []);

    validateTriggerList.forEach((triggerName: string) => {
      // Wrap additional function of component, so that we can get latest value from store
      const originTrigger = control[triggerName];
      control[triggerName] = (...args: EventArgs) => {
        if (originTrigger) {
          originTrigger(...args);
        }

        // Always use latest rules
        const { rules } = this.props;
        if (rules && rules.length) {
          // We dispatch validate to root,
          // since it will update related data with other field with same name
          dispatch({
            type: "validateField",
            namePath,
            triggerName,
          });
        }
      };
    });

    return control;
  };

  // Only return validate child node. If invalidate, will do nothing about field.
 public getOnlyChild = (
    children:
      | React.ReactNode
      | ((control: ChildProps, meta: Meta, context: FormInstance) => React.ReactNode),
  ): { child: React.ReactNode | null; isFunction: boolean } => {
    // 当子元素是函数时，调用并传参
    // Support render props
    if (typeof children === 'function') {
      const meta = this.getMeta();

      return {
        // 调用时传入control、meta、context
        ...this.getOnlyChild(children(this.getControlled(), meta, this.props.fieldContext)),
        isFunction: true,
      };
    }

  public render() {
    const { resetCount } = this.state;
    const { children } = this.props;

    //// 获取处理好的子元素
    const { child, isFunction } = this.getOnlyChild(children);

    // Not need to `cloneElement` since user can handle this in render function self
    let returnChildNode: React.ReactNode;

    if (isFunction) {
      // 这里child.props是空对象
      returnChildNode = child;
    }

    return <React.Fragment key={resetCount}>{returnChildNode}</React.Fragment>;
  }

  constructor();
}
```

其中 control 对象就包括了操作和读取 form 内部该组件值的 value 和 onChange

到这边，整个流程就都读了一遍了
