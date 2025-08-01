---
title: NumPy 使用指南
---

## NumPy

数组：数据类型一致

列表：指针数，不用数据类型一致

数组的维度根据需要的索引来确定

NumPy的数组：有序，类型相同 优先级：str>float>int

```python
np.array(object,dtype=np.float32)  	#把列表构建一个numpy数组,object是列表，dtype是类型numpy内置了一些类型	例：np.float32
np.ones(shape) #用1来填充
np.zeros(shape) #用0填充
shape = (m,n) m行n列的二维数组
shape = (m) m个元素的一维数组  [1,2,3]
shape = (m,) m个元素的一维数组
shape = (m,1) m行1列的二维数组 [[1],[2],[3]]
shape = (1,n) 1行n列的二维数组 [[1,2,3]]
shape=(2,3,4)

np.full(shape，fill_value=6) #用fill_value填充

np.eye(N=3,M=4，k=1)  #单位矩阵 生成一个三阶矩阵，默认M=N一般不用，k用来控制对角的移动

等差数
np.linspace(start,stop,num,endpoint=True)	#等差数列	start起始数	stop结束数	num取几个数	endpoint为True时保留最后一个否则不保留
np.arange(start,stop,step)	#等差数列 start起使数	stop结束数 step步长(差值)	默认不取最后一个值


随机数
np.random.randint(low,high,size)	#随机数 在low和high间取值,size等同于shape

np.random.randn(d0,d1....dn) #标准正态分布 d0一维的个数，d1二维的个数

np.random.normal(loc,scale，size) #普通正态分布 loc数学期望(接近的值) scale方差 size等同于shape

np.random.random(size) #生成0~1之间的随机数

np.random.permutation(10) #生成一组随机索引
```

ndarray的属性

- ndim：维度

- shape：形状

- size：总长度

- dtype：元素类型

  ```python
  arr = np.random.randint(0,100,(5,4,3))
  
  arr.ndim #获取维度
  arr.shape #获取形状
  arr.size #获取总长度
  arr.dtype #获取数组元素类型
  type(arr) #获取数组类型
  ```

  ### 索引

```python
arr = np.array([[1,2,3],[4,5,6]])
#列表的索引方式
arr[0][0]
#numpy特有的索引
arr[0,0]=1  #赋值
arr[[1,2]]
#BOOL列表作为列表索引访问,True对应的值会被返回
bool_list = [True,False,True,False,True]
arr[bool_list]
```

### 切片

所有切片都是左闭右开区间

```python
#行切片
arr[0:2]
#列切片
arr[:,0:2] #:从头切到位，前面的维度用：最后一个正常切片
#数据反转
arr[::-1]
[1, 2, 3]
[3, 2, 1]
```

### 变形

```python
arr.reshape(shape=(4,5)) #标准写法，注意元素个数
arr.reshape(4,5)
```

### 级联

```python
arr1 = [[1,2,3],[4,5,6]]
arr2 = [[1,2,3],[4,5,6]]

np.concatenate((arr1,arr2),axis=0) #axis默认为0纵向连接，等于1时是横向连接
np.hstack((arr1,arr2))#横向连接  数组的行数要一致
np.vstack((arr1,arr2))#纵向连接  数组的列数要一致
```

### 切分

```python

arr2 = [[1,2,3],[4,5,6],[1,2,3],[4,5,6]]
a1,a2 = np.split(arr2 ,indices_or_sections=2，axis=0)#indices_or_sections切割的份数

a1,a2 = np.split(arr,indices_or_sections=[1,3]，axis=1)#1前面的是一列1~3是一列3后面的是一列(多用于横向切割维度内个数为不能等分的)
np.hsplit(arr,indices_or_sections=[1,3])#纵向切分
np.vsplit(arr,indices_or_sections=[1,3])#横向切分
```

### 副本

所有赋值运算会改变原数据

可以使用copy()函数创建副本

```python
copy_arr = arr.copy()
## list拷贝
import copy
## 浅拷贝
copy_list = copy.copy(data_list)
## 深拷贝
deep_copy_list = copy.deepcopy(data_list)
```

### 聚合操作

```python
#求和
arr.sum()
arr.sum(axis=0) #求列方向的和，为1时是行
#最大值
arr.max()
#最大值索引 arr[arr.argmax()] == arr.max()
arr.argmax()
#最小值
arr.min()
#最小值索引	arr[arr.argmin()] == arr.min()
arr.argmin()
#平均值
arr.mean()
#标准方差(标准差) ((a1-mean)**2+(a2-mean)**2......(an-mean)**2)/n 数据波动
arr.std(axis=1)
#方差
arr.var()
#中位数
np.median(arr)
```

### 广播机制

- 为缺失的维度补1
- 假定缺失的元素用已有的值填充

```python
#矩阵运算
np.dot(arr1,arr2)
```

### 排序

```python
#改变原始数据
print(arr)
[1, 2, 3, 4].sort()
arr.sort()
print(arr)
#不改变
print(arr)
new_arr = np.sort(arr)
print(arr， new_arr)
#部分排序 k为正，排序最小的k个数，k为负，排序最大的k个 后面跟上切片[:k],[-k:]
np.partltion(arr,k)
np.partltion([1, 2, 3, 4], [:3])
```

### 数据保存

```python
import numpy as np

arr = np.array([1, 2, 3, 4])
## json , xml....
## name.npy
np.save('name.npz', arr ) ## 保存numpy文件
np.load('name.npz.npy')	## 读取numpy文件
```

#### json保存

```python
import json
## json方式保存数据
with open('name.json', 'w', encoding='utf-8') as f:
    f.write(
        json.dumps(arr.tolist())
    )
## json方式读取数据
with open('name.json', 'r', encoding='utf-8') as f:
	print(np.array(json.loads(f.read())))
```