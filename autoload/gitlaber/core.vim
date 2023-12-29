function! gitlaber#core#open_project_issues() abort
  call gitlaber#ui#open_project_issue_list_panel()
  call gitlaber#core#set_issues_display()
endfunction

function! gitlaber#core#set_issues_display() abort
  let projcet_id = gitlaber#api#get_project_id()
  let t:project_issues = gitlaber#api#get_project_issues(projcet_id)
  let project_issue_titles = gitlaber#util#make_issue_title_list(t:project_issues)
  setlocal modifiable
  call append(0, project_issue_titles)
  normal! ddgg
  setlocal nomodifiable
endfunction

function! gitlaber#core#reload_project_issues() abort
  setlocal modifiable
  silent %delete
  setlocal nomodifiable
  call gitlaber#core#set_issues_display()
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

function! gitlaber#core#create_project_issue() abort
  let title = input("Enter new issue title: ")
  if title == "" || title == v:null
    echo 'Creation of new issue has been canceled.'
    return
  endif
  let attr_dict = {"title": title}
  let project_id = gitlaber#api#get_project_id()
  let result = gitlaber#api#create_project_issue(project_id, attr_dict)
  if has_key(result, 'message')
    echo 'Failed to create new issue. reason: ' . result['message']
    return
  endif
  echo 'Successfully created a new issue.'
endfunction

function! gitlaber#core#delete_project_issue() abort
  let confirm = input("Are you sure you want to delete the issue? y/N: ")
  if confirm != "y"
    return
  endif
  let index = line('.') - 1
  let issue_node = t:project_issues[index]
  let iid = issue_node['iid']
  let project_id = gitlaber#api#get_project_id()
  let status_code = gitlaber#api#delete_project_issue(project_id, iid)
  if status_code != 204
    echom "Failed to delete issue."
    return
  endif
    echom "Successfully to delete issue."
endfunction
