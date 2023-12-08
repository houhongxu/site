# useRequest

useRequest 使用的插件机制
通过 useRequestImplement 引入插件

```ts
// function useRequest<TData, TParams extends any[], TFormated, TTFormated extends TFormated = any>(
//   service: Service<TData, TParams>,
//   options: OptionsWithFormat<TData, TParams, TFormated, TTFormated>,
//   plugins?: Plugin<TData, TParams>[],
// ): Result<TFormated, TParams>
// function useRequest<TData, TParams extends any[]>(
//   service: Service<TData, TParams>,
//   options?: OptionsWithoutFormat<TData, TParams>,
//   plugins?: Plugin<TData, TParams>[],
// ): Result<TData, TParams>
function useRequest<TData, TParams extends any[]>(
  service: Service<TData, TParams>, // service就是接口
  options?: Options<TData, TParams>, // options就是配置项
  plugins?: Plugin<TData, TParams>[], // plugins是插件
) {
  return useRequestImplement<TData, TParams>(service, options, [
    ...(plugins || []),
    useDebouncePlugin,
    useLoadingDelayPlugin,
    usePollingPlugin,
    useRefreshOnWindowFocusPlugin,
    useThrottlePlugin,
    useAutoRunPlugin,
    useCachePlugin,
    useRetryPlugin,
  ] as Plugin<TData, TParams>[])
}
```

## useRequestImplement

```ts
function useRequestImplement<TData, TParams extends any[]>(
  service: Service<TData, TParams>, // service就是接口，useRequset透传
  options: Options<TData, TParams> = {}, // options就是配置项，useRequset透传
  plugins: Plugin<TData, TParams>[] = [], // plugins是插件，
) {
  const { manual = false, ...rest } = options

  // 开发环境
  if (isDev) {
    if (options.defaultParams && !Array.isArray(options.defaultParams)) {
      console.warn(
        `expected defaultParams is array, got ${typeof options.defaultParams}`,
      )
    }
  }

  // 将配置了默认manual的配置项给fetch
  const fetchOptions = {
    manual,
    ...rest,
  }

  // 始终保存最新的请求函数
  const serviceRef = useLatest(service)

  const update = useUpdate()

  const fetchInstance = useCreation(() => {
    const initState = plugins
      .map((p) => p?.onInit?.(fetchOptions))
      .filter(Boolean)

    return new Fetch<TData, TParams>(
      serviceRef,
      fetchOptions,
      update,
      Object.assign({}, ...initState),
    )
  }, [])
  fetchInstance.options = fetchOptions
  // run all plugins hooks
  fetchInstance.pluginImpls = plugins.map((p) => p(fetchInstance, fetchOptions))

  useMount(() => {
    if (!manual) {
      // useCachePlugin can set fetchInstance.state.params from cache when init
      const params = fetchInstance.state.params || options.defaultParams || []
      // @ts-ignore
      fetchInstance.run(...params)
    }
  })

  useUnmount(() => {
    fetchInstance.cancel()
  })

  return {
    loading: fetchInstance.state.loading,
    data: fetchInstance.state.data,
    error: fetchInstance.state.error,
    params: fetchInstance.state.params || [],
    cancel: useMemoizedFn(fetchInstance.cancel.bind(fetchInstance)),
    refresh: useMemoizedFn(fetchInstance.refresh.bind(fetchInstance)),
    refreshAsync: useMemoizedFn(fetchInstance.refreshAsync.bind(fetchInstance)),
    run: useMemoizedFn(fetchInstance.run.bind(fetchInstance)),
    runAsync: useMemoizedFn(fetchInstance.runAsync.bind(fetchInstance)),
    mutate: useMemoizedFn(fetchInstance.mutate.bind(fetchInstance)),
  } as Result<TData, TParams>
}
```
