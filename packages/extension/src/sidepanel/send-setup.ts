// ============================================================
// Design Mode — "Finish setup" dialog for Send to Agent
// ============================================================
//
// Send to Agent only sends when a coding agent is really connected. When it
// isn't, the panel shows this dialog instead of sending: it says in plain
// words what is missing and gives the exact fix in place (a connect button,
// a copyable command or config). Nothing here navigates away from the panel.
//
// Pure functions only (state in, HTML string out) so the content per blocker
// is unit-testable without a DOM. sidepanel.ts owns the state, focus handling
// and the live re-check.

import { sendToAgentBlock } from '../platform/analytics';

export type SendSetupMode = 'local' | 'cloud' | 'self-hosted';
export type SendSetupState = 'offline' | 'running' | 'connected';
export type SendSetupStep = 'connect-cloud' | 'start-local' | 'reconnect' | 'reload-page' | 'add-agent' | 'ready';

export interface SendSetupTool { key: string; label: string; path: string }

export interface SendSetupModel {
  mode: SendSetupMode;
  state: SendSetupState;
  /** Error code from the last status probe ('' when none). */
  statusIssue: string;
  hasToken: boolean;
  cloudUrl: string;
  localPort: number;
  registering: boolean;
  checking: boolean;
  /** MCP config JSON for the current mode, already containing the token. */
  mcpConfig: string;
  /** What is shown for mcpConfig (token masked). */
  mcpConfigDisplay: string;
  localCommand: string;
  tools: SendSetupTool[];
  changeCount: number;
}

export interface SendSetupDeps {
  esc: (value: string) => string;
  icon: (name: any, size?: number) => string;
}

const PAGE_ISSUES = ['no_content_script', 'restricted_url', 'tab_closed', 'cross_origin_iframe'];

/** Which setup step the user is on. `ready` means a real send can go out. */
export function sendSetupStep(m: Pick<SendSetupModel, 'mode' | 'state' | 'statusIssue' | 'hasToken'>): SendSetupStep {
  const block = sendToAgentBlock(m.state, m.mode, m.hasToken, m.statusIssue);
  if (!block) return 'ready';
  const code = block.error_code || '';
  if (code === 'no_agent_connected') return 'add-agent';
  if (PAGE_ISSUES.includes(code)) return 'reload-page';
  if (code === 'cloud_token_missing' || code === 'auth_token_invalid') return m.mode === 'local' ? 'start-local' : 'connect-cloud';
  if (m.mode === 'local') return 'start-local';
  return m.hasToken ? 'reconnect' : 'connect-cloud';
}

export const LOCAL_REPO_PLACEHOLDER = '/path/to/design-mode';

export function localMcpCommand(): string {
  return 'claude mcp add design-mode -- npm start --prefix ' + LOCAL_REPO_PLACEHOLDER + '/packages/mcp-local';
}

export function localMcpConfig(): string {
  return JSON.stringify({
    mcpServers: { 'design-mode': { command: 'npm', args: ['start'], cwd: LOCAL_REPO_PLACEHOLDER + '/packages/mcp-local' } },
  }, null, 2);
}

function statusText(m: SendSetupModel, step: SendSetupStep): { dot: string; text: string; ok: boolean } {
  if (m.checking) return { dot: 'var(--dm-yellow)', text: '확인 중…', ok: false };
  if (step === 'ready') return { dot: 'var(--dm-success)', text: '연결됨 — 에이전트 준비 완료', ok: true };
  if (step === 'add-agent') {
    return { dot: 'var(--dm-yellow)', text: (m.mode === 'local' ? '로컬 서버 실행 중' : '중계 서버 연결됨') + ' — 에이전트 연결 대기 중', ok: false };
  }
  return { dot: 'var(--dm-danger)', text: '아직 연결되지 않았습니다', ok: false };
}

export const SEND_SETUP_RETRY_HINT = '설정이 완료된 상태라면 연결 또는 에이전트를 재시작하거나 새 세션을 시작하세요.';

const BTN = 'padding:6px 10px;border-radius:6px;font-size:11px;font-family:inherit;cursor:pointer;';
const BTN_SECONDARY = BTN + 'background:var(--dm-btn-bg);border:1px solid var(--dm-btn-border);color:var(--dm-text);';
const BTN_PRIMARY = BTN + 'background:var(--dm-accent-bg);border:1px solid var(--dm-accent-border);color:var(--dm-accent);font-weight:600;';

export function renderSendSetupDialog(m: SendSetupModel, deps: SendSetupDeps): string {
  const { esc, icon } = deps;
  const step = sendSetupStep(m);
  const status = statusText(m, step);

  const code = (t: string) => '<code style="font-family:SF Mono,Monaco,monospace;font-size:10px;background:var(--dm-bg-secondary);border:1px solid var(--dm-separator);border-radius:3px;padding:1px 4px;word-break:break-all;">' + esc(t) + '</code>';
  const p = (html: string) => '<p style="margin:0;font-size:11px;line-height:1.55;color:var(--dm-text-secondary);">' + html + '</p>';
  const copyBlock = (label: string, shown: string, payload: string, step: string) =>
    '<div style="display:flex;flex-direction:column;gap:4px;">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">' +
    '<span style="font-size:11px;font-weight:600;color:var(--dm-text);">' + esc(label) + '</span>' +
    '<button type="button" data-dm-action="send-setup-copy" data-dm-setup-step="' + step + '" data-dm-payload="' + esc(payload) + '" aria-label="복사: ' + esc(label) + '" style="' + BTN_SECONDARY + 'display:inline-flex;align-items:center;gap:4px;">' + icon('copy', 11) + ' Copy</button>' +
    '</div>' +
    '<pre tabindex="0" aria-label="' + esc(label) + '" style="margin:0;padding:8px;background:var(--dm-bg-secondary);border:1px solid var(--dm-separator);border-radius:6px;font-family:SF Mono,Monaco,monospace;font-size:10px;line-height:1.5;color:var(--dm-text);white-space:pre-wrap;word-break:break-all;max-height:150px;overflow:auto;">' + esc(shown) + '</pre>' +
    '</div>';
  const stepList = (items: string[]) =>
    '<ol style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px;font-size:11px;line-height:1.55;color:var(--dm-text-secondary);">' +
    items.map(i => '<li>' + i + '</li>').join('') + '</ol>';
  const switchMode = (to: SendSetupMode, label: string) =>
    '<button type="button" data-dm-mcp-mode="' + to + '" data-dm-setup-step="switch_to_' + to + '" style="background:none;border:none;padding:0;color:var(--dm-accent);font-size:11px;font-family:inherit;cursor:pointer;text-decoration:underline;align-self:flex-start;">' + esc(label) + '</button>';

  let title = '';
  let intro = '';
  let body = '';

  if (step === 'connect-cloud') {
    const selfHosted = m.mode === 'self-hosted';
    const rejected = m.statusIssue === 'auth_token_invalid';
    title = rejected ? 'Design Mode를 에이전트에 다시 연결' : 'Design Mode를 에이전트에 연결';
    intro = rejected
      ? '서버가 이 브라우저의 기기 토큰을 거부했습니다. 전송되지 않았습니다. 아래에서 새 토큰을 생성하세요.'
      : 'AI 전송을 사용하려면 브라우저와 코딩 에이전트를 한 번 연결해야 합니다. 아직 전송되지 않았습니다.';
    body =
      (selfHosted
        ? '<label style="display:flex;flex-direction:column;gap:4px;font-size:11px;font-weight:600;color:var(--dm-text);">Server URL' +
          '<input type="text" id="dm-send-setup-cloud-url" class="dm-input" data-dm-setting="cloudUrl" value="' + esc(m.cloudUrl) + '" placeholder="https://your-server.example" style="padding:6px 8px;background:var(--dm-input-bg);border:1px solid var(--dm-input-border);border-radius:6px;color:var(--dm-text);font-size:11px;font-family:inherit;font-weight:400;"></label>'
        : '') +
      p('Click <b>연결</b> to create a device token. It stays in this browser. Then you’ll copy a short config into your agent.') +
      '<button type="button" data-dm-action="mcp-cloud-register" data-dm-setup-step="connect_cloud" data-dm-setup-autofocus ' + (m.registering ? 'disabled aria-disabled="true" ' : '') + 'style="' + BTN_PRIMARY + 'align-self:flex-start;' + (m.registering ? 'opacity:.6;cursor:default;' : '') + '">' + (m.registering ? '연결 중…' : (rejected ? '새 토큰 생성' : 'Connect to ' + (selfHosted ? 'server' : 'Cloud'))) + '</button>' +
      switchMode('local', '이 컴퓨터의 로컬 서버 사용');
  } else if (step === 'start-local') {
    title = '로컬 Design Mode 서버 시작';
    intro = 'Local 모드는 이 컴퓨터의 소형 서버에 연결합니다 (port ' + m.localPort + '). 서버가 실행 중이 아닙니다. 전송되지 않았습니다.';
    body =
      p('터미널에서 한 번 실행하여 Claude Code에 서버를 등록하세요. ' + code(LOCAL_REPO_PLACEHOLDER) + ' 부분은 Design Mode를 복제한 폴더로 바꾸세요.') +
      copyBlock('터미널 명령', m.localCommand, m.localCommand, 'copy_terminal_command') +
      stepList([
        '에이전트를 시작하면 서버가 실행됩니다.',
        'Press <b>다시 확인</b> below. This window turns green when the server is up.',
      ]) +
      '<details style="font-size:11px;color:var(--dm-text-secondary);"><summary style="cursor:pointer;color:var(--dm-text);">다른 에이전트를 사용하나요?</summary>' +
      '<div style="display:flex;flex-direction:column;gap:6px;margin-top:6px;">' +
      p('이 설정을 에이전트의 MCP 설정에 추가하세요.') +
      copyBlock('MCP 설정', m.mcpConfigDisplay, m.mcpConfig, 'copy_mcp_config') + '</div></details>' +
      switchMode('cloud', 'Cloud 사용 (로컬 실행 불필요)');
  } else if (step === 'reconnect') {
    title = '이 탭 다시 연결';
    intro = '설정은 완료됐으나 이 탭이 중계 서버에 연결되어 있지 않습니다. 아직 전송되지 않았습니다.';
    body =
      p('Press <b>다시 연결</b>. If it stays red, check your internet connection or the server URL.') +
      '<button type="button" data-dm-action="send-setup-reconnect" data-dm-setup-step="reconnect" data-dm-setup-autofocus style="' + BTN_PRIMARY + 'align-self:flex-start;">다시 연결</button>';
  } else if (step === 'reload-page') {
    const restricted = m.statusIssue === 'restricted_url';
    title = 'Design Mode가 이 페이지에 접근할 수 없습니다';
    intro = restricted
      ? '브라우저가 이 종류의 페이지에서 확장 실행을 허용하지 않습니다. 전송되지 않았습니다.'
      : 'Design Mode가 아직 이 탭에 연결되지 않았습니다. 전송되지 않았습니다.';
    body = restricted
      ? stepList(['일반 탭에서 편집할 사이트를 여세요. (<b>chrome://</b>, 웹스토어, PDF 제외)', 'Press <b>다시 확인</b> below.'])
      : stepList(['편집 중인 페이지를 새로고침하세요 (<b>Cmd/Ctrl + R</b>).', 'Press <b>다시 확인</b> below.']);
  } else if (step === 'add-agent') {
    title = '코딩 에이전트에 Design Mode 추가';
    intro = (m.mode === 'local' ? '로컬 서버가 실행 중입니다' : '중계 서버가 연결되었습니다') + ' 하지만 코딩 에이전트가 아직 연결되지 않았습니다. 전송되지 않았습니다.';
    body =
      stepList([
        '아래 설정을 복사하여 에이전트(Claude Code, Cursor, Windsurf 등)의 MCP 설정에 붙여 넣으세요.',
        '에이전트를 재시작한 후 ' + code('/design-mode') + ' 명령을 실행하세요 (먼저 아래에서 명령을 저장하세요).',
        '에이전트가 연결되면 이 창의 상태가 녹색으로 바뀝니다.',
      ]) +
      copyBlock('MCP 설정', m.mcpConfigDisplay, m.mcpConfig, 'copy_mcp_config') +
      '<details style="font-size:11px;color:var(--dm-text-secondary);"><summary style="cursor:pointer;color:var(--dm-text);">처음인가요? /design-mode 명령 저장</summary>' +
      '<div style="display:flex;flex-direction:column;gap:6px;margin-top:6px;">' +
      p('복사한 뒤 프로젝트 내 에이전트별 표시 경로에 파일로 저장하세요.') +
      m.tools.map(t =>
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">' +
        '<span style="font-size:11px;color:var(--dm-text);">' + esc(t.label) + ' ' + code(t.path) + '</span>' +
        '<button type="button" data-dm-action="copy-agent-command" data-dm-tool="' + esc(t.key) + '" data-dm-setup-step="copy_agent_command" aria-label="복사: command for ' + esc(t.label) + '" style="' + BTN_SECONDARY + 'flex-shrink:0;">복사</button></div>'
      ).join('') + '</div></details>';
  } else {
    title = '전송 준비 완료';
    intro = m.changeCount > 0
      ? '에이전트가 연결되었습니다. 변경사항 ' + m.changeCount + '개를 전송하세요.'
      : '에이전트가 연결되었습니다.';
    body = p('Press <b>AI 에이전트로 전송</b>. The agent implements your changes and marks each one done in the Changes tab.');
  }

  const canSend = step === 'ready';
  return '<div data-dm-send-setup-backdrop style="position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:60;display:flex;align-items:center;justify-content:center;">' +
    '<div role="dialog" aria-modal="true" aria-labelledby="dm-send-setup-title" aria-describedby="dm-send-setup-desc" data-dm-send-setup data-dm-send-setup-step="' + step + '" tabindex="-1" style="background:var(--dm-bg);border:1px solid var(--dm-separator-strong);border-radius:10px;padding:14px;width:320px;max-width:calc(100vw - 24px);max-height:calc(100vh - 24px);overflow:auto;box-shadow:0 8px 24px rgba(0,0,0,0.3);display:flex;flex-direction:column;gap:10px;outline:none;">' +
    '<div style="display:flex;align-items:flex-start;gap:8px;">' +
    '<span style="display:flex;color:var(--dm-accent);margin-top:2px;" aria-hidden="true">' + icon('send', 14) + '</span>' +
    '<h2 id="dm-send-setup-title" style="margin:0;flex:1;font-size:13px;font-weight:600;line-height:1.35;color:var(--dm-text);">' + esc(title) + '</h2>' +
    '<button type="button" data-dm-action="send-setup-close" aria-label="닫기" style="background:none;border:none;padding:2px;color:var(--dm-text-secondary);cursor:pointer;display:flex;">' + icon('x', 14) + '</button>' +
    '</div>' +
    '<p id="dm-send-setup-desc" style="margin:0;font-size:11px;line-height:1.55;color:var(--dm-text-secondary);">' + esc(intro) + '</p>' +
    body +
    (step === 'ready' ? '' : p(SEND_SETUP_RETRY_HINT)) +
    '<div role="status" aria-live="polite" data-dm-send-setup-status="' + (status.ok ? 'ok' : 'pending') + '" style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:var(--dm-bg-secondary);border:1px solid var(--dm-separator);border-radius:6px;font-size:11px;color:var(--dm-text);">' +
    '<span aria-hidden="true" style="width:8px;height:8px;border-radius:50%;flex-shrink:0;background:' + status.dot + ';"></span><span>' + esc(status.text) + '</span></div>' +
    '<div style="display:flex;gap:6px;">' +
    '<button type="button" data-dm-action="send-setup-recheck" data-dm-setup-step="recheck" style="' + BTN_SECONDARY + 'flex:1;">다시 확인</button>' +
    '<button type="button" data-dm-action="send-setup-send" ' + (canSend ? '' : 'disabled aria-disabled="true" ') + 'style="' + BTN_PRIMARY + 'flex:1;' + (canSend ? '' : 'opacity:.5;cursor:default;') + '">AI 에이전트로 전송</button>' +
    '</div></div></div>';
}
