
const myChart4 = echarts.init(document.getElementById("chart3"));
async function setChart4(search_value,search_value2,search_value3) {
  // 2. 从后端获取数据
   let chart_data = [];
   try {
    // 构建查询 URL，name 是必须的，location 和 grade 是可选的
    let url = `/get_trend?name=${search_value}`;
    if (search_value2) {
      url += `&location=${search_value2}`;  // 如果 location 存在，加入到 URL 中
    }
    if (search_value3) {
      url += `&grade=${search_value3}`;  // 如果 grade 存在，加入到 URL 中
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    chart_data = data.data; // 获取后端返回的数据
  } catch (error) {
    console.error("Error fetching data:", error);
    return;
  }


  if (chart_data.length === 0) {
    alert("未找到该木材的价格信息");
    return;
  }
  document.getElementById("current_name").innerHTML =search_value + (search_value2==undefined || search_value2==''?'':` - ${search_value2}`) + (search_value3==undefined || search_value3==''?'':` - ${search_value3}`);
  console.log(
    search_value3
  );
  
   // 3. 数据处理
   const dates = chart_data.map(item => item.date); // x轴日期
  // 4、定义图表配置项
  const option = {
    tooltip: {
      trigger: "axis", // 提示框
      formatter: function (params) {
        let item = params[0]; // 取第一项
        return `日期: ${item.name}<br>价格: ${chart_data[item.dataIndex].price}`;
      }
    },
    // 设置图表的边距
    grid: {
      top: 80, // 距离上边80
      left: 60, // 距离左边60
      right: 40, // 距离右边40
      bottom: 50 // 距离下边50
    },
    // x轴
    xAxis: {
      // x轴的数据是
      data: dates
    },
    // y轴
    yAxis: {
      type: "value"
    },
    // 数据
    series: [
      {
        name: "价格", 
        type: "line", // line类型是折线图
        color: "#93e7be", // 线颜色是蓝色
        data: chart_data.map(item => item.value), // y轴为数值部分
      }
    ]
  };
  // 3、生成图表
  myChart4.setOption(option);
}
const search_value = document.getElementById("search");
search_value.value = "落叶松";
setChart4("落叶松");

function search() {
  const search_value = document.getElementById("search").value;
  const search_value2 = document.getElementById("search2").value;
  const search_value3 = document.getElementById("search3").value;
  setChart4(search_value,search_value2,search_value3);
}