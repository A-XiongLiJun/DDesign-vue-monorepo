import { defineComponent, onMounted, ref, watch, watchEffect, type PropType } from 'vue'
import { DInput } from '../components'
import { UserTreeNodeList, type UniqueTreeNode } from './components/UserTreeNodeList'
import type { TreeNode } from './type'
import { UserTreeOperationList } from './components/UserTreeOperationList'
import './style'

export const UserTreeContent = defineComponent({
  name: 'UserTreeContent',
  props: {
    treeData: {
      type: Array as PropType<TreeNode[]>,
      required: true,
    },
  },
  emits: ['checked', 'search'],
  setup(props, { emit }) {
    const searchContent = ref('')
    const listRef = ref<TreeNode[]>([])
    const checkedNodes = ref<TreeNode[]>([])
    const deleteNode = ref<UniqueTreeNode>()
    function createUniqueNode(node: TreeNode) {
      deleteNode.value = {
        ...node,
        uniqueId: Symbol(),
      }
    }
    onMounted(() => {
      listRef.value = props.treeData
    })
    watchEffect(() => {
      listRef.value = props.treeData
    })
    watch(checkedNodes, (newValue) => {
      emit('checked', newValue)
    })
    watch(searchContent, (value) => {
      emit('search', value)
    })
    return () => (
      <div class="dtd-user-tree-content-layout">
        <div class="dtd-user-tree-content-left">
          <DInput v-model:value={searchContent.value} placeholder="搜索" />
          <UserTreeNodeList
            list={listRef.value}
            v-model:checkedNodes={checkedNodes.value}
            deleteNode={deleteNode.value}
          />
        </div>
        <div class="dtd-user-tree-content-right">
          <UserTreeOperationList
            checkedNodes={checkedNodes.value}
            onDelete={(node) => createUniqueNode(node)}
          />
        </div>
      </div>
    )
  },
})
