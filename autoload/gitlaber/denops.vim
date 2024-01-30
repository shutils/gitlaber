function! gitlaber#denops#open_main_panel() abort
  call denops#notify('gitlaber', 'doAction', [{'name': 'project-status'}])
endfunction

function! gitlaber#denops#close_all() abort
  call denops#notify('gitlaber', 'doAction', [{'name': 'buffer-close-all'}])
endfunction

function! gitlaber#denops#lint_ci() abort
  call denops#notify('gitlaber', 'doAction', [{'name': 'ci-lint'}])
endfunction
