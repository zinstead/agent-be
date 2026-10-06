import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 10, // 100个虚拟用户
  duration: "1m", // 持续30秒
};

export default function () {
  const api = "http://localhost:5000/api/agent/intent";
  const api2 = "http://localhost:5000/api/agent/filter";

  const body = JSON.stringify({
    messages: [{ role: "user", content: "查看项目100的配体组，entry是401" }],
  });
  const body2 = JSON.stringify({
    userGoal: "筛选分子，要求logP在1-3，分子量小于500，预测ddg小于-1",
    filters: null,
  });

  const res = http.post(api, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  // if (res.status !== 200) {
  //   console.log(`Status: ${res.status}, Body: ${res.body}`);
  // }

  if (res.status === 200) {
    console.log(`Body: ${res.body}`);
  }

  check(res, {
    "status is 200": (r) => r.status === 200,
  });
}
