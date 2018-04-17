这里放绩效模块业务组件
> ### KeywordSearch组件使用示例
>
>     <keyword-search
>       v-model="keyword"
>       @search="search">
>     </keyword-search>
>
> keyword (String)：绑定搜索输入框的值
>
> search (Func): enter触发事件

> ### ProgressBar组件使用示例
>
>     <progress-bar
>       :plan-status="planProgressStatus"
>       :all-status="allStatus">
>     </progress-bar>
>
> plan-status (Number): 绑定步骤条状态
>
> all-status (Array): [planProgressStatus, dealPerson[{ dealPersonName, dealPersonRole, isFinished }]]
>  planProgressStatus：对应步骤条中某一步骤
>  dealPerson：对应planProgressStatus步骤中操作的人的信息
