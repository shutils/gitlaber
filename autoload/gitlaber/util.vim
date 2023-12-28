function! gitlaber#util#save_temp_json(attr_dict) abort
  let temp_bufnr = bufadd("gitlaber_temp")
  call bufload(temp_bufnr)
  let encoded_dict = json_encode(a:attr_dict)
  call setbufline(temp_bufnr, 1, [encoded_dict])
  let tempfile = tempname()
  new
  execute 'buffer ' . temp_bufnr
  execute 'write ' . tempfile
  quit
  return tempfile
endfunction

function! gitlaber#util#make_new_issue_attr_dict(bufnr) abort
  let buftitle = getbufvar(a:bufnr, 'title')
  let bufinfo = getbufinfo(a:bufnr)[0]
  let description = join(getbufline(a:bufnr, 1, '$'), "\n")
  return {'title': buftitle, 'description': description}
endfunction
