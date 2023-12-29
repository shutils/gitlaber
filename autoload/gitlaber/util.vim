function! gitlaber#util#save_temp_json(attr_dict) abort
  let temp_bufnr = bufadd("gitlaber_temp")
  call bufload(temp_bufnr)
  let encoded_dict = json_encode(a:attr_dict)
  call setbufline(temp_bufnr, 1, [encoded_dict])
  let tempfile = tempname()
  new
  execute 'buffer ' . temp_bufnr
  execute 'silent write ' . tempfile
  setlocal buftype=nofile
  bdelete
  return tempfile
endfunction

function! gitlaber#util#make_new_issue_attr_dict(bufnr) abort
  let buftitle = getbufvar(a:bufnr, 'title')
  let bufinfo = getbufinfo(a:bufnr)[0]
  let description = join(getbufline(a:bufnr, 1, '$'), "\n")
  return {'title': buftitle, 'description': description}
endfunction

function! gitlaber#util#make_issue_title_list(issues) abort
  let issues_index_max_width = len(string(a:issues[-1]['iid'])) + 1
  let project_issue_titles = []
  for issue in a:issues
    let title = '#' . string(issue.iid) . repeat(' ', (issues_index_max_width - len(string(issue.iid)))) . ' ' . issue.title
    call add(project_issue_titles, title)
  endfor
  return project_issue_titles
endfunction
