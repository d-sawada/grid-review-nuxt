<template>
  <div>
    <h-table :data="data" :columns="columns" />
  </div>
</template>

<script>
import HTable from '@/components/HTable'

export default {
  components: {
    HTable
  },

  data: () => ({
    data: [
      {
        settlementDate: '2020/08/10',
        loanMoney: 50000,
        otherFee: 37800,
        customerName: '澤田 大輔',
        customerAge: 24
      },
      {
        settlementDate: '2020/08/20',
        loanMoney: 40000,
        otherFee: 37800,
        customerName: '澤田 大輔',
        customerAge: 24
      },
      {
        settlementDate: '2020/08/30',
        loanMoney: 30000,
        otherFee: 37800,
        customerName: '澤田 大輔',
        customerAge: 24
      }
    ],
    columns: [
      { header: '取引日', field: 'settlementDate', type: 'date' },
      { header: '融資金額(千円)', field: 'loanMoney', type: 'tenthousand' },
      { header: 'その他費用', field: 'otherFee', type: 'currensy' },
      { header: '顧客氏名', field: 'customerName', type: 'text' },
      { header: '年齢', field: 'customerAge', type: 'numeric' }
    ]
  })
}
</script>
