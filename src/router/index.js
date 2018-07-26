import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Warehouse from '@/components/Warehouse'
import Booking from '@/components/booking'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/commodity/warehouse',
      name: 'Warehouse',
      component: Warehouse
    },
    {
      path: '/order/booking',
      name: 'Booking',
      component: Booking
    }
  ]
})
