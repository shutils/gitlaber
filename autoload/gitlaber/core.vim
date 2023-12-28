function! gitlaber#core#open_project_issues() abort
  let projcet_id = gitlaber#api#get_project_id()
  let t:project_issues = gitlaber#api#get_project_issues(projcet_id)
  let issues_index_max_width = len(string(t:project_issues[-1]['iid'])) + 1
  let project_issue_titles = []
  for issue in t:project_issues
    let line = '#' . string(issue.iid) . repeat(' ', (issues_index_max_width - len(string(issue.iid)))) . ' ' . issue.title
    call add(project_issue_titles, line)
  endfor
  call gitlaber#ui#open_project_issue_list_panel()
  call append(0, project_issue_titles)
  normal! ddgg
  setlocal buftype=nofile
  setlocal nomodifiable
endfunction

function! gitlaber#core#open_issue_preview() abort
  let index = line('.') - 1
  let issue_node = t:project_issues[index]
  let description = issue_node['description']
  let lines = split(description, '\n')
  call gitlaber#ui#open_issue_preview_panel()
  call append(0, lines)
  normal! ddgg
  setlocal filetype=markdown
  setlocal buftype=nofile
  setlocal nomodifiable
endfunction
