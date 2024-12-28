async function setChart3() {
  // 1、获取要画图表的标签
  var myChart = echarts.init(document.getElementById("chart2"));
  
  // 初始化数据
  let chart_data = [];
  
  // 2. 网络请求，获取 name 数据
  try {
    const response = await fetch("/name_statistics");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json(); // 获取后端返回的数据
    chart_data = data.data; // 提取数据
  } catch (error) {
    console.error("Error fetching data:", error);
    return; // 如果发生错误，提前退出
  }

  // 3、定义图表配置项
  var option = {
    color: ["#9accff", "#ffcccc", "#9e9e9e", "#ff6666", "#66b3ff"], // 饼图颜色
    tooltip: {
      trigger: "item", // 鼠标移入时显示
      formatter: "{b}: {c} ({d}%)", // 提示框显示名称、数量和百分比
    },
    legend: {
      bottom: 20, // 图例距下边20
      itemWidth: 10, // 图例宽度
      itemHeight: 10 // 图例高度
    },
    grid: { top: 40 }, // 图表距上边40
    series: [
      {
        type: "pie", // pie类型为饼图
        center: ["50%", "47%"], // 饼图位置
        radius: "50%", // 饼图大小
        itemStyle: {
          borderRadius: 5, // 每块的边框圆角为5
          borderColor: "#fff", // 每块的边框颜色为白色
          borderWidth: 4 // 每块的边框宽度为4
        },
        data: chart_data // 使用获取到的 data 数据
      }
    ]
  };

  // 4、生成图表
  myChart.setOption(option);
}

// 调用函数渲染饼图
setChart3();
