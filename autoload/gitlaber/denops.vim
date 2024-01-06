function! gitlaber#denops#open_main_panel() abort
  call denops#notify('gitlaber', 'openGitlaber', [])
endfunction

function! gitlaber#denops#open_issue_panel() abort
  call denops#notify('gitlaber', 'openProjectIssuePanel', [])
endfunction

function! gitlaber#denops#open_issues_panel() abort
  call denops#notify('gitlaber', 'openProjectIssuesPanel', [])
endfunction

function! gitlaber#denops#create_new_pro_issue() abort
  call denops#request('gitlaber', 'createNewProjectIssue', [])
endfunction

function! gitlaber#denops#delete_pro_issue() abort
  call denops#request('gitlaber', 'deleteProjectIssue', [])
endfunction

function! gitlaber#denops#reload_pro_issue() abort
  call denops#notify('gitlaber', 'reloadProjectIssues', [])
endfunction

function! gitlaber#denops#open_pro_issue_preview() abort
  call denops#request('gitlaber', 'openProjectIssuePreview', [])
endfunction

function! gitlaber#denops#get_current_node() abort
  return denops#request('gitlaber', '_getCurrentNode', [])
endfunction

function! gitlaber#denops#open_pro_issue_edit() abort
  call denops#request('gitlaber', 'openProjectIssueEditBuf', [])
endfunction

function! gitlaber#denops#edit_issue() abort
  return denops#request('gitlaber', 'editProjectIssue', [])
endfunction
