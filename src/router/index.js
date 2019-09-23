import Vue from "vue";
import Router from "vue-router";
/* import Recommend from "@/components/recommend/recommend";
import Singer from "@/components/singer/singer";
import Rank from "@/components/rank/rank";
import SingerDetail from "@/components/singer-detail/singer-detail";
import SongListDetail from "@/components/songList-detail/songList-detail";
import RankDetail from "@/components/rank-detail/rank-detail";
import Search from "@/components/search/search";
 */
const Recommend = (resolve) => {
  import('@/components/recommend/recommend').then((module) => {
    resolve(module)
  })
}

const Singer = (resolve) => {
  import('@/components/singer/singer').then((module) => {
    resolve(module)
  })
}

const Rank = (resolve) => {
  import('@/components/rank/rank').then((module) => {
    resolve(module)
  })
}

const Search = (resolve) => {
  import('@/components/search/search').then((module) => {
    resolve(module)
  })
}

const SingerDetail = (resolve) => {
  import('@/components/singer-detail/singer-detail').then((module) => {
    resolve(module)
  })
}

const SongListDetail = (resolve) => {
  import('@/components/songList-detail/songList-detail').then((module) => {
    resolve(module)
  })
}

const RankDetail = (resolve) => {
  import('@/components/rank-detail/rank-detail').then((module) => {
    resolve(module)
  })
}

const User = (resolve) => {
  import('@/components/user/user').then((module) => {
    resolve(module)
  })
}

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/recommend"
    },
    {
      path: "/recommend",
      component: Recommend,
      children: [
        {
          path: ":id",
          component: SongListDetail
        }
      ]
    },
    {
      path: "/singer",
      component: Singer,
      children: [
        {
          path: ":id",
          component: SingerDetail
        }
      ]
    },
    {
      path: "/rank",
      component: Rank,
      children: [
        {
          path: ":id",
          component: RankDetail
        }
      ]
    },
    {
      path: "/search",
      component: Search,
      children: [
        {
          path: "singer/:id",
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: User
    }
  ]
});
