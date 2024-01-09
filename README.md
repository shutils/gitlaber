# gitlaber

## Notice

This plugin is not yet complete.  
Breaking changes may be made to the current specifications.

## About

This plugin is an integration of [Gitlab REST API](https://docs.gitlab.com/ee/api/rest/).

## Required

[denops](https://github.com/vim-denops/denops.vim)

[tryu/open-browser.vim](https://github.com/tyru/open-browser.vim) (optional)

## Installation

Install it with your plugin manager. Below is an example of lazy.nvim.

```lua
require("lazy").setup({
  {
    "shutils/gitlaber",
    dependencies = {
      "vim-denops/denops.vim",
    },
  },
})
```

## Usage

### Setting

Since gitlaber uses Gitlab's private token, please set the environment variables as follows.

```sh
export GITLAB_TOKEN=<Your private token>
```

Also, if you use self-hosted Gitlab, you need to set the environment variables as follows.

```sh
export GITLAB_URL=<Your self hosted gitlab url>
```

GITLAB_TOKEN,GITLAB_URL can also be set in the project repository using the git config command.

```sh
git config --local gitlab.token <Your private token>
git config --local gitlab.url <Your self hosted gitlab url>
```

If token and url are set in git config, those values will be used with highest priority.

### `Gitlaber` command

This command will open a new tab and display gitlaber main panel.

### Panels

gitlaber has several panels.
Each panel has a default keymap.

#### Main panel

| Function         | Key map | Implemented        |
| ---------------- | ------- | ------------------ |
| Open issue panel | i       | :white_check_mark: |
| Open wiki panel  | w       |                    |
| Open in browser  | o       | :white_check_mark: |
| Quit             | q       | :white_check_mark: |

#### Issue panel

| Function                 | Key map | Implemented        |
| ------------------------ | ------- | ------------------ |
| Open issue list          | l       | :white_check_mark: |
| Create new project issue | n       | :white_check_mark: |
| Quit                     | q       | :white_check_mark: |

#### Issue list panel

| Function              | Key map | Implemented        |
| --------------------- | ------- | ------------------ |
| Preview project issue | p       | :white_check_mark: |
| Edit project issue    | e       | :white_check_mark: |
| Delete project issue  | d       | :white_check_mark: |
| Reload project issue  | r       | :white_check_mark: |
| Quit                  | q       | :white_check_mark: |
| Create issue branch   | b       | :white_check_mark: |
| Open in browser       | o       | :white_check_mark: |

#### Wiki panel

| Function                | Key map | Implemented        |
| ----------------------- | ------- | ------------------ |
| Open wiki list          | l       | :white_check_mark: |
| Create new project wiki | n       | :white_check_mark: |
| Quit                    | q       | :white_check_mark: |

#### Wiki list panel

| Function             | Key map | Implemented        |
| -------------------- | ------- | ------------------ |
| Preview project wiki | p       | :white_check_mark: |
| Edit project wiki    | e       | :white_check_mark: |
| Delete project wiki  | d       | :white_check_mark: |
| Quit                 | q       | :white_check_mark: |
| Open in browser      | o       | :white_check_mark: |

#### Branch panel

| Function         | Key map | Implemented        |
| ---------------- | ------- | ------------------ |
| Open branch list | l       | :white_check_mark: |
| Quit             | q       | :white_check_mark: |

#### Branch list panel

| Function  | Key map | Implemented        |
| --------- | ------- | ------------------ |
| Create mr | M       | :white_check_mark: |
| Quit      | q       | :white_check_mark: |

## Roadmap

This plugin will implement the following functions.

### Core feature

- [ ] Project operation
  - [x] View summary
  - [x] Open in browser (required: tryu/open-browser.vim)
  - [ ] View members
  - [ ] List of milestones
- [ ] Issue operation
  - [x] Create a new issue
  - [x] View issue list
  - [x] View a issue description
  - [ ] View a issue with comment
  - [x] Edit a issue description
  - [x] Delete a issue
  - [ ] View change history
  - [ ] Search issue
  - [ ] Change issue state _NOTE:_ close or reopen
  - [ ] Change issue assignee
  - [ ] Change issue label
  - [x] Create related branches
  - [ ] Create related merge request
  - [x] Open in browser (required: tryu/open-browser.vim)
- [ ] Wiki operation
  - [x] Create a new wiki
  - [x] View wiki list
  - [x] View a wiki
  - [x] Edit a wiki
  - [x] Delete a wiki
  - [x] Open in browser (required: tryu/open-browser.vim)
  - [ ] View change history
- [ ] Merge request operation
  - [ ] Create a new mr
  - [ ] View a mr description
  - [ ] View a mr with comment
  - [ ] Edit a mr description
  - [ ] Delete a mr
  - [ ] View change history
  - [ ] Search mr
- [ ] Branch operation
  - [ ] Create a new branch
  - [x] Create a mr from branch
  - [x] View branch list
  - [ ] Delete a branch
  - [ ] Search branch

### Other feature

- [ ] Custom keymap config

## License

MIT
