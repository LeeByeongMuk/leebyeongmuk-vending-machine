import * as readline from "readline";

/**
 * @function askQuestion
 * @description Node.js 내장 readline 모듈을 사용하여 사용자로부터 입력을 받아오는 함수입니다.
 *              주어진 쿼리 문자열을 출력하고, 사용자가 입력한 값을 Promise 형태로 반환합니다.
 * @param {string} query - 사용자에게 보여줄 질문(프롬프트) 메시지입니다.
 * @returns {Promise<string>} 사용자가 입력한 값을 포함하는 Promise 객체를 반환합니다.
 *
 * @example
 * askQuestion("이름을 입력하세요: ").then(answer => {
 *   console.log(`입력한 이름: ${answer}`);
 * });
 */
export function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}
