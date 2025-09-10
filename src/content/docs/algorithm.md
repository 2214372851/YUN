---
title: 算法集
---

> 由于用于学习所以采用多语言混写的方式，思路一致

## [两数之和](https://leetcode.cn/problems/two-sum/)

给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出 **和为目标值** *`target`* 的那 **两个** 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。

你可以按任意顺序返回答案。

> 解析：本处使用 Rust 实现，时间、空间复杂度为 O(n)，遍历输入数组，对每个数字，计算其与目标值的差值（即“补数”），检查哈希表中是否存在该补数。如果存在，说明找到了两个数，它们的和等于目标值，返回它们的索引，如果不存在，将当前数字和索引存入哈希表，继续遍历，如果遍历结束仍未找到，返回空向量。 

```rust
fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
    let mut index_map = std::collections::HashMap::new();
    for (i, num) in nums.iter().enumerate() {
        let complement = target - num;
        if let Some(&index) = index_map.get(&complement) {
            return vec![index as i32, i as i32]
        }
        index_map.insert(num, i);
    };
    return vec![]
}
```

## [两数相加](https://leetcode.cn/problems/add-two-numbers/)

给你两个 **非空** 的链表，表示两个非负的整数。它们每位数字都是按照 **逆序** 的方式存储的，并且每个节点只能存储 **一位** 数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

> 解析：本处使用 Rust 实现，时间、空间复杂度为 O(n)，将两个列表当作两个数字，我们需要创建2个指针，指向当前链表位置，还需要一个数来记录链表数相加大于10的情况，最后我们需要返回一个链表，所以我们需要创建一个新的链表来存储计算结果，函数刚进入我们并不知道第一个值为多少所以设置为0，实际返回的是该链表的 next

```rust
// Definition for singly-linked list.
#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
  pub val: i32,
  pub next: Option<Box<ListNode>>
}

impl ListNode {
  #[inline]
  fn new(val: i32) -> Self {
    ListNode {
      next: None,
      val
    }
  }
}
fn add_two_numbers(l1: Option<Box<ListNode>>, l2: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
    let mut new_head = ListNode::new(0);
    let mut current = &mut new_head;
    let mut carry = 0;

    let (mut p1, mut p2) = (l1.as_ref(), l2.as_ref());

    while p1.is_some() || p2.is_some() || carry > 0 {
        let x = p1.map_or(0, |node| node.val);
        let y = p2.map_or(0, |node| node.val);
        let sum = x + y + carry;
        carry = sum / 10;
        current.next = Some(Box::new(ListNode::new(sum % 10)));
        current = current.next.as_mut().unwrap();

        if let Some(node) = p1 {
            p1 = node.next.as_ref();
        }
        if let Some(node) = p2 {
            p2 = node.next.as_ref();
        }
    }
    new_head.next
}
fn main() {
    // l1 = [2,4,3], l2 = [5,6,4]
    let l1 = Some(Box::new(ListNode {
        val: 2,
        next: Some(Box::new(ListNode {
            val: 4,
            next: Some(Box::new(ListNode::new(3))),
        })),
    }));
    let l2 = Some(Box::new(ListNode {
        val: 5,
        next: Some(Box::new(ListNode {
            val: 6,
            next: Some(Box::new(ListNode::new(4))),
        })),
    }));
    let result = add_two_numbers(l1, l2);
    println!("{:?}", result);
}
```



## [无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

给定一个字符串 `s` ，请你找出其中不含有重复字符的 **最长 子串** 的长度。

> 解析：本算法使用 Rust 实现，时间和空间复杂度均为 O(n)。核心思想是滑动窗口：用两个指针 left 和 right 表示当前不含重复字符的子串区间。用哈希表 char_index_map 记录每个字符上一次出现的位置。每当遇到重复字符时，更新 left 指针到重复字符的下一个位置，保证窗口内无重复。每次遍历时计算当前窗口长度，更新最大值。最终返回最长无重复子串的长度。

```rust
fn length_of_longest_substring(s: String) -> i32 {
    use std::collections::HashMap;
    let mut char_index_map = HashMap::new();
    let (mut left, mut max_length) = (0, 0);
    
    for (right, char) in s.chars().enumerate() {
        if let Some(&prev_index) = char_index_map.get(&char) {
            left = left.max(prev_index + 1);
        }

        char_index_map.insert(char, right);
        max_length = max_length.max(right - left + 1);
    }

    max_length as i32
}
fn main() {
    let s = String::from("pwwkew");
    let result = length_of_longest_substring(s);
    println!("Length of longest substring: {}", result);
}
```

