function! gitlaber#api#get_issues() abort
  let token = $GITLAB_TOKEN
  let url = $GITLAB_URL
  let cmd = 'curl -s -H "PRIVATE-TOKEN: ' . token . '" --url "' . url . '/api/v4/issues"'
  try
    let issues_json = system(cmd)
    let decoded_issues = json_decode(issues_json)
    for issue_node in decoded_issues
      echom issue_node['title']
    endfor
    return decoded_issues
  catch
    echom "error"
  endtry
endfunction

function! gitlaber#api#get_issue(id) abort
  let token = $GITLAB_TOKEN
  let url = $GITLAB_URL
  let id = a:id
  let cmd = 'curl -s -H "PRIVATE-TOKEN: ' . token . '" --url "' . url . '/api/v4/issues/' . string(id) . '"'
  try
    let issue_json = system(cmd)
    let decoded_issue = json_decode(issue_json)
    return decoded_issue
  catch
    echom "error"
  endtry
endfunction

function! gitlaber#api#get_project_issue(project_id, issue_iid) abort
  let token = $GITLAB_TOKEN
  let url = $GITLAB_URL
  let cmd = 'curl -s -H "PRIVATE-TOKEN: ' . token . '" --url "' . url . '/api/v4/projects/' . string(a:project_id) . "/issues/" . string(a:issue_iid) . '"'
  try
    let issue_json = system(cmd)
    let decoded_issue = json_decode(issue_json)
    return decoded_issue
  catch
    echom "error"
  endtry
endfunction

function! gitlaber#api#edit_project_issue(project_id, issue_iid, bufnr) abort
  let token = $GITLAB_TOKEN
  let url = $GITLAB_URL
  let temp_bufnr = bufadd("gitlaber_temp")
  call bufload(temp_bufnr)
  let put_dict = {"description": join(getbufline(a:bufnr, 0, '$'), "\n")}
  let encoded_dict = json_encode(put_dict)
  call setbufline(temp_bufnr, 1, [encoded_dict])
  let tempfile = tempname()
  new
  execute 'buffer ' . temp_bufnr
  execute 'write ' . tempfile
  quit
  let cmd = 'curl -s --request PUT -H "Content-Type: application/json" -H "PRIVATE-TOKEN: ' . token . '" -d @' . tempfile . ' --url "' . url . '/api/v4/projects/' . string(a:project_id) . "/issues/" . string(a:issue_iid) . '"'
  echom cmd
  try
    let issue_json = system(cmd)
    let decoded_issue = json_decode(issue_json)
    call system("rm", tempfile)
    echom decoded_issue
    return decoded_issue
  catch
    echom "error"
  endtry
endfunction
