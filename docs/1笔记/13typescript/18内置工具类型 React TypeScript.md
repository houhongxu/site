# 内置工具类型 React TypeScript

## 组件声明

```ts
interface FunctionComponent<P = {}> {
  (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null
  propTypes?: WeakValidationMap<P> | undefined
  contextTypes?: ValidationMap<any> | undefined
  defaultProps?: Partial<P> | undefined
  displayName?: string | undefined

  type PropsWithChildren<P> = P & { children?: ReactNode | undefined };
}
```

## 组件泛型

使用简单函数和使用 FC 的重要差异之一就在于，使用 FC 时你无法再使用组件泛型

```ts
interface ICellProps<TData> {
  //
  field: keyof TData
}

const Cell = <T extends Record<string, any>>(
  props: PropsWithChildren<ICellProps<T>>
) => {
  return <p></p>
}
```

## 泛型坑位

```ts
// 提供了默认值
function useState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>]

// 没有提供默认值
function useState<S = undefined>(): [
  S | undefined,
  Dispatch<SetStateAction<S | undefined>>
]
```
