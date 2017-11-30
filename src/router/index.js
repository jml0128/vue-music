import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import MusicList from '@/components/MusicList'
import PlayMusic from '@/components/PlayMusic'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/2',
      name: 'MusicList',
      component: MusicList
    },
    {
      path: '/3/:id',
      name: 'PlayMusic',
      component: PlayMusic
    }
  ]
})
