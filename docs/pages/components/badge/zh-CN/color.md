### 彩色指示器

`color` 属性设置徽标提示点样式，选项包括: 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'violet'

<!--start-code-->

```js
const instance = (
  <div>
    <Badge color="red">Red</Badge>
    <Badge color="orange">Orange</Badge>
    <Badge color="yellow">Yellow</Badge>
    <Badge color="green">Green</Badge>
    <Badge color="cyan">Cyan</Badge>
    <Badge color="blue">Blue</Badge>
    <Badge color="violet">Violet</Badge>
    <Badge color="red" />
    <Badge color="orange" />
    <Badge color="yellow" />
    <Badge color="green" />
    <Badge color="cyan" />
    <Badge color="blue" />
    <Badge color="violet" />
    <Badge color="blue" content="99+" />
    <Badge color="violet" content="NEW" />
  </div>
);
ReactDOM.render(instance);
```

<!--end-code-->
