# 📋 Masonry 快速参考指南

## 🚀 5分钟快速开始

### 1. 安装 Masonry

```objective-c
// Podfile
pod 'Masonry'

// 执行安装
pod install
```

### 2. 基础使用

```objective-c
#import <Masonry/Masonry.h>

// 填充父视图
[view mas_makeConstraints:^(MASConstraintMaker *make) {
    make.edges.equalTo(superview);
}];

// 居中 + 固定尺寸
[view mas_makeConstraints:^(MASConstraintMaker *make) {
    make.center.equalTo(superview);
    make.size.mas_equalTo(CGSizeMake(100, 100));
}];

// 水平排列
[view1 mas_makeConstraints:^(MASConstraintMaker *make) {
    make.left.equalTo(superview).offset(10);
    make.top.bottom.equalTo(superview);
    make.width.equalTo(superview).dividedBy(3);
}];
```

---

## 🎯 常用API速查

### 基础属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `left` | 左边距 | `make.left.equalTo(superview).offset(10)` |
| `right` | 右边距 | `make.right.equalTo(superview).offset(-10)` |
| `top` | 上边距 | `make.top.equalTo(superview).offset(20)` |
| `bottom` | 下边距 | `make.bottom.equalTo(superview).offset(-20)` |
| `width` | 宽度 | `make.width.mas_equalTo(100)` |
| `height` | 高度 | `make.height.mas_equalTo(50)` |
| `centerX` | 水平居中 | `make.centerX.equalTo(superview)` |
| `centerY` | 垂直居中 | `make.centerY.equalTo(superview)` |

### 复合属性

```objective-c
// 全边距
make.edges.equalTo(superview).insets(UIEdgeInsetsMake(10, 10, 10, 10));

// 尺寸
make.size.mas_equalTo(CGSizeMake(100, 100));

// 居中
make.center.equalTo(superview);
```

### 链式配置

```objective-c
// 关系
make.left.equalTo(superview)
make.width.greaterThanOrEqualTo(100)
make.height.lessThanOrEqualTo(200)

// 偏移
make.left.offset(10)           // +10
make.right.offset(-10)         // -10
make.center.offset(CGPointMake(5, -5))

// 优先级
make.width.equalTo(superview).priorityHigh()
make.width.equalTo(superview).priority(750)

// 比例
make.width.equalTo(superview).multipliedBy(0.5)  // 50%
make.width.equalTo(superview).dividedBy(2)       // 50%

// 标识
make.left.offset(10).key(@"leftConstraint")
```

---

## 🎨 常见场景模板

### 场景 1: 填充父视图

```objective-c
[view mas_makeConstraints:^(MASConstraintMaker *make) {
    make.edges.equalTo(superview).insets(UIEdgeInsetsMake(10, 10, 10, 10));
}];
```

### 场景 2: 居中显示

```objective-c
[view mas_makeConstraints:^(MASConstraintMaker *make) {
    make.center.equalTo(superview);
    make.size.mas_equalTo(CGSizeMake(200, 100));
}];
```

### 场景 3: 顶部固定

```objective-c
[header mas_makeConstraints:^(MASConstraintMaker *make) {
    make.left.right.top.equalTo(superview);
    make.height.mas_equalTo(60);
}];
```

### 场景 4: 底部工具栏

```objective-c
[toolbar mas_makeConstraints:^(MASConstraintMaker *make) {
    make.left.right.bottom.equalTo(superview);
    make.height.mas_equalTo(44);
}];
```

### 场景 5: 水平等宽排列

```objective-c
// 3个视图
[views mas_distributeViewsAlongAxis:MASAxisTypeHorizontal
                    withFixedSpacing:10
                         leadSpacing:10
                         tailSpacing:10];

[views mas_makeConstraints:^(MASConstraintMaker *make) {
    make.top.bottom.equalTo(superview);
}];
```

### 场景 6: 垂直排列

```objective-c
[views mas_distributeViewsAlongAxis:MASAxisTypeVertical
                    withFixedSpacing:10
                         leadSpacing:10
                         tailSpacing:10];

[views mas_makeConstraints:^(MASConstraintMaker *make) {
    make.left.right.equalTo(superview);
}];
```

### 场景 7: 自适应高度

```objective-c
[label mas_makeConstraints:^(MASConstraintMaker *make) {
    make.left.equalTo(superview).offset(15);
    make.right.equalTo(superview).offset(-15);
    make.top.equalTo(superview).offset(20);
}];

[contentView mas_makeConstraints:^(MASConstraintMaker *make) {
    make.left.right.equalTo(superview);
    make.top.equalTo(label.mas_bottom).offset(15);
    make.bottom.equalTo(superview).offset(-15);
}];
```

### 场景 8: 键盘响应

```objective-c
// 显示键盘
- (void)keyboardWillShow:(NSNotification *)notification {
    NSDictionary *userInfo = notification.userInfo;
    CGRect keyboardFrame = [userInfo[UIKeyboardFrameEndUserInfoKey] CGRectValue];
    CGFloat keyboardHeight = keyboardFrame.size.height;

    [self.view mas_updateConstraints:^(MASConstraintMaker *make) {
        make.bottom.equalTo(superview).offset(-keyboardHeight);
    }];

    [UIView animateWithDuration:0.3 animations:^{
        [self.view layoutIfNeeded];
    }];
}

// 隐藏键盘
- (void)keyboardWillHide {
    [self.view mas_updateConstraints:^(MASConstraintMaker *make) {
        make.bottom.equalTo(superview);
    }];

    [UIView animateWithDuration:0.3 animations:^{
        [self.view layoutIfNeeded];
    }];
}
```

### 场景 9: 动画过渡

```objective-c
[UIView animateWithDuration:0.5 animations:^{
    [self.view mas_updateConstraints:^(MASConstraintMaker *make) {
        make.height.mas_equalTo(300);
        make.width.equalTo(superview).multipliedBy(0.9);
    }];
    [self.view layoutIfNeeded];  // 关键！
}];
```

### 场景 10: 条件布局

```objective-c
- (void)updateLayout:(BOOL)isExpanded {
    if (isExpanded) {
        [self.view mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.edges.equalTo(superview);
        }];
    } else {
        [self.view mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.left.right.equalTo(superview);
            make.top.offset(100);
            make.height.mas_equalTo(200);
        }];
    }

    [UIView animateWithDuration:0.3 animations:^{
        [self.view layoutIfNeeded];
    }];
}
```

---

## ⚠️ 常见陷阱

### ❌ 错误 1: 重复创建约束

```objective-c
// ❌ 错误
- (void)layoutSubviews {
    [super layoutSubviews];
    [self.view mas_makeConstraints:^(MASConstraintMaker *make) {  // 每次都创建！
        make.edges.equalTo(superview);
    }];
}

// ✅ 正确
- (void)updateConstraints {
    if (!self.hasSetupConstraints) {
        [self setupConstraints];
        self.hasSetupConstraints = YES;
    }
    [super updateConstraints];
}
```

### ❌ 错误 2: 循环引用

```objective-c
// ❌ 错误
[self.view mas_makeConstraints:^(MASConstraintMaker *make) {
    make.edges.equalTo(self.view);  // self被强引用
}];

// ✅ 正确
__weak typeof(self) weakSelf = self;
[self.view mas_makeConstraints:^(MASConstraintMaker *make) {
    make.edges.equalTo(weakSelf.view);
}];
```

### ❌ 错误 3: 视图未添加到父视图

```objective-c
// ❌ 错误
UIView *view = [[UIView alloc] init];
[view mas_makeConstraints:^(MASConstraintMaker *make) {
    make.edges.equalTo(superview);  // superview为nil
}];

// ✅ 正确
[superview addSubview:view];
[view mas_makeConstraints:^(MASConstraintMaker *make) {
    make.edges.equalTo(superview);
}];
```

### ❌ 错误 4: 约束冲突

```objective-c
// ❌ 错误（多次调用makeConstraints）
[view mas_makeConstraints:^(MASConstraintMaker *make) {
    make.left.offset(10);
}];
[view mas_makeConstraints:^(MASConstraintMaker *make) {
    make.left.offset(20);  // 冲突！
}];

// ✅ 正确（使用updateConstraints）
[view mas_makeConstraints:^(MASConstraintMaker *make) {
    make.left.offset(10);
}];
[view mas_updateConstraints:^(MASConstraintMaker *make) {
    make.left.offset(20);  // 更新，不冲突
}];
```

---

## 🎯 方法对比

| 方法 | 作用 | 适用场景 |
|------|------|----------|
| `makeConstraints` | 创建新约束 | 首次布局 |
| `updateConstraints` | 更新常量值 | 动态调整 |
| `remakeConstraints` | 重做所有约束 | 布局切换 |

---

## 🔧 调试技巧

### 1. 添加标识

```objective-c
[view mas_makeConstraints:^(MASConstraintMaker *make) {
    make.left.equalTo(superview).offset(10).key(@"leftConstraint");
    make.top.equalTo(superview).offset(20).key(@"topConstraint");
}];
```

### 2. 查看约束

```objective-c
NSArray *constraints = [MASViewConstraint installedConstraintsForView:view];
for (MASViewConstraint *constraint in constraints) {
    NSLog(@"Constraint: %@", constraint.layoutConstraint);
}
```

### 3. 检查冲突

```objective-c
- (void)checkConflicts {
    NSArray *constraints = self.view.constraints;
    NSMutableDictionary *count = [NSMutableDictionary dictionary];

    for (NSLayoutConstraint *constraint in constraints) {
        if (constraint.firstItem == self.view) {
            NSNumber *attr = @(constraint.firstAttribute);
            count[attr] = @(count[attr].integerValue + 1);
        }
    }

    for (NSNumber *attr in count) {
        if (count[attr].integerValue > 1) {
            NSLog(@"⚠️ 冲突: 属性%ld有多个约束", (long)attr.integerValue);
        }
    }
}
```

---

## 📱 版本兼容

### iOS 11+ 安全区域

```objective-c
if (@available(iOS 11.0, *)) {
    make.top.equalTo(view.mas_safeAreaLayoutGuideTop);
} else {
    make.top.equalTo(view);
}
```

### 简化写法

```objective-c
// 使用宏
#define IS_IOS11_OR_LATER ([[NSProcessInfo processInfo] operatingSystemVersion].majorVersion >= 11)

if (IS_IOS11_OR_LATER) {
    make.edges.equalTo(view.mas_safeAreaLayoutGuide);
} else {
    make.edges.equalTo(view);
}
```

---

## 🎓 学习路径

### 初学者 (1小时)
1. 阅读本快速参考
2. 运行基础示例
3. 尝试常见场景

### 进阶者 (3小时)
1. 阅读完整文档
2. 理解生命周期
3. 掌握最佳实践

### 专家级 (6小时)
1. 深入源码
2. 性能优化
3. 扩展框架

---

## 📚 完整文档

需要更详细的内容？请查看完整文档：

- 📖 **架构概览**: `markdown/01_架构概览.md`
- 🔍 **核心组件**: `markdown/02_核心组件详解.md`
- 🎨 **设计模式**: `markdown/03_设计模式分析.md`
- ⚙️ **生命周期**: `markdown/04_生命周期流程.md`
- 🛠️ **API指南**: `markdown/05_API使用指南.md`
- 🚀 **最佳实践**: `markdown/06_最佳实践.md`
- 💻 **源码解析**: `markdown/07_源码深度解析.md`
- 🌍 **生态分析**: `markdown/08_生态分析.md`

---

## 🔗 相关资源

- **GitHub**: https://github.com/SnapKit/Masonry
- **文档**: 本地 `README.md`
- **部署**: 本地 `DEPLOYMENT.md`
- **示例**: `html/index.html`

---

**版本**: v1.0
**最后更新**: 2024-12-23
**适用**: iOS/macOS 开发者