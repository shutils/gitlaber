function! gitlaber#denops#open_main_panel() abort
  call denops#notify('gitlaber', 'openGitlaber', [])
endfunction

function! gitlaber#denops#open_issue_panel() abort
  call denops#notify('gitlaber', 'openProjectIssuePanel', [])
endfunction

function! gitlaber#denops#open_issues_panel() abort
  call denops#notify('gitlaber', 'openProjectIssuesPanel', [])
endfunction

function! gitlaber#denops#open_wiki_panel() abort
  call denops#notify('gitlaber', 'openProjectWikiPanel', [])
endfunction

function! gitlaber#denops#open_wikis_panel() abort
  call denops#notify('gitlaber', 'openProjectWikisPanel', [])
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

function! gitlaber#denops#open_create_new_pro_wiki_buf() abort
  call denops#request('gitlaber', 'openCreateNewProjectWikiBuf', [])
endfunction

function! gitlaber#denops#create_new_pro_wiki() abort
  call denops#request('gitlaber', 'createProjectNewWiki', [])
endfunction

function! gitlaber#denops#open_pro_wiki_preview() abort
  call denops#request('gitlaber', 'openProjectWikiPreview', [])
endfunction

function! gitlaber#denops#open_edit_pro_wiki_buf() abort
  call denops#request('gitlaber', 'openEditProjectWikiBuf', [])
endfunction

function! gitlaber#denops#edit_wiki() abort
  return denops#request('gitlaber', 'editProjectWiki', [])
endfunction

function! gitlaber#denops#reload_pro_wikis() abort
  call denops#notify('gitlaber', 'reloadProjectWikis', [])
endfunction

function! gitlaber#denops#delete_pro_wiki() abort
  call denops#request('gitlaber', 'deleteProjectWiki', [])
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
