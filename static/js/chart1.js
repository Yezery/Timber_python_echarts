function setChart1() {
  // 1、获取要画图表的标签
  var myChart = echarts.init(document.getElementById("chart1"));
  // 2、定义图表配置项
  const option = {
    tooltip: { trigger: "axis" }, // 提示框 鼠标放到柱子上提示年龄分布
    // 设置图表的边距
    grid: {
      top: 80, // 距离上边80
      left: 60, // 距离左边60
      right: 40, // 距离右边40
      bottom: 50 // 距离下边50
    },
    // x轴
    xAxis: {
      // x轴的数据是文章
      data: [
        "18岁以下",
        "18-25岁",
        "26-35岁",
        "36-45岁",
        "46-60岁",
        "60岁以上",
        "未知"
      ]
    },
    // y轴
    yAxis: {
      type: "value"
    },
    // 数据
    series: [
      {
        name: "年龄分布", // 名字是年龄分布
        type: "bar", // bar类型是柱状图
        barWidth: 20, // 柱子宽度20
        color: "#9accff", // 柱子颜色是蓝色
        label: { show: true, position: "top" }, // 柱子显示数据
        itemStyle: {
          barBorderRadius: [3, 3, 0, 0] // 设置柱子的圆角
        },
        data: [1, 212, 4, 7, 5, 2, 44] // 数据是年龄分布
      }
    ]
  };
  // 3、生成图表
  myChart.setOption(option);
}
setChart1();
