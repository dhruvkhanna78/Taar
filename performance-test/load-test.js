import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 75,
  duration: '90s',
};

export default function () {
  http.get(
    'https://taar-server.onrender.com/api/v1/post/all',
    {
      headers: {
        Cookie: 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWJiMGM0Yjc3YTJlZGVlNjc4NzhhMTkiLCJpYXQiOjE3NzcyOTE0MjIsImV4cCI6MTc3Nzg5NjIyMn0.tJaAp8H2LB-zazT_hyvY5ul049jgtFZPiLdU9UhDBrA',
      },
    }
  );

  sleep(1);
}