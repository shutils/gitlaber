function! gitlaber#open_project_issues() abort
  let projcet_id = gitlaber#api#get_project_id()
  let project_issues = gitlaber#api#get_project_issues(projcet_id)
  let project_issue_titles = map(project_issues, {_, v -> v.title})
  new
  call append(0, project_issue_titles)
  normal! ddgg
  setlocal buftype=nofile
  setlocal nomodifiable
endfunction
