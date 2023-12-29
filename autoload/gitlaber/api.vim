function! gitlaber#api#get_issues() abort
  let token = $GITLAB_TOKEN
  let url = $GITLAB_URL
  let cmd = 'curl -s -H "PRIVATE-TOKEN: ' . token . '" --url "' . url . '/api/v4/issues"'
  try
    let issues_json = system(cmd)
    let decoded_issues = json_decode(issues_json)
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

function! gitlaber#api#get_project_issues(project_id) abort
  let token = $GITLAB_TOKEN
  let url = $GITLAB_URL
  let cmd = 'curl -s -H "PRIVATE-TOKEN: ' . token . '" --url "' . url . '/api/v4/projects/' . string(a:project_id) . '/issues?per_page=100&state=opened"'
  try
    let issues_json = system(cmd)
    let decoded_issues = json_decode(issues_json)
    return decoded_issues
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

function! gitlaber#api#edit_project_issue(project_id, issue_iid, attr_dict) abort
  let token = $GITLAB_TOKEN
  let url = $GITLAB_URL
  let tempfile = gitlaber#util#save_temp_json(a:attr_dict)
  let cmd = 'curl -s --request PUT -H "Content-Type: application/json" -H "PRIVATE-TOKEN: ' . token . '" -d @' . tempfile . ' --url "' . url . '/api/v4/projects/' . string(a:project_id) . "/issues/" . string(a:issue_iid) . '"'
  try
    let issue_json = system(cmd)
    let decoded_issue = json_decode(issue_json)
    call system("rm", tempfile)
    return decoded_issue
  catch
    echom "error"
  endtry
endfunction

function! gitlaber#api#create_project_issue(project_id, attr_dict) abort
  let token = $GITLAB_TOKEN
  let url = $GITLAB_URL
  let tempfile = gitlaber#util#save_temp_json(a:attr_dict)
  let cmd = 'curl -s --request POST -H "Content-Type: application/json" -H "PRIVATE-TOKEN: ' . token . '" -d @' . tempfile . ' --url "' . url . '/api/v4/projects/' . string(a:project_id) . '/issues"'
  try
    let issue_json = system(cmd)
    let decoded_issue = json_decode(issue_json)
    call system("rm", tempfile)
    return decoded_issue
  catch
    echom "error"
  endtry
endfunction

function! gitlaber#api#delete_project_issue(project_id, iid) abort
  let token = $GITLAB_TOKEN
  let url = $GITLAB_URL
  let cmd = 'curl -s --request DELETE -o /dev/null -w "%{http_code}\n" -H "PRIVATE-TOKEN: ' . token . '" --url "' . url . '/api/v4/projects/' . string(a:project_id) . '/issues/' . a:iid . '"'
  try
    return system(cmd)
  catch
    echom "An error occurred while deleting the issue."
  endtry
endfunction

function! gitlaber#api#get_project_id() abort
  let token = $GITLAB_TOKEN
  let url = $GITLAB_URL
  let project_url = system("git config --get remote.origin.url")
  let project_url = substitute(project_url, '\n', '', '')

  let name_space = split(project_url, "/")[-2]
  let project_path = split(project_url, "/")[-1]
  let project_path = substitute(project_path, ".git", "", "")
  let cmd = 'curl -s --request GET -H "PRIVATE-TOKEN: ' . token . '" --url "' . url . '/api/v4/projects/' . name_space . '%2F' . project_path . '"'
  try
    let project_json = system(cmd)
    let decoded_project = json_decode(project_json)
    return decoded_project['id']
  catch
    echom "error"
  endtry
endfunction
