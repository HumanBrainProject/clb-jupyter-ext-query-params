import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import {  INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { sendKernelRequestFromNotebook } from './NotebookUtils';

const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyter-ext-query-params',
  autoStart: true,
  requires: [INotebookTracker],
  activate: async (
    app: JupyterFrontEnd,
    tracker: INotebookTracker,
  ) => {
    tracker.widgetAdded.connect((_, nbPanel: NotebookPanel ) => {
      nbPanel.session.ready.then(() => {
      const searchParams = new URLSearchParams(window.location.search);
      let code = "import os\n";
      for (const [key, value] of searchParams) {
        code += `os.environ['${key}']='${value}'\n`;
      }
      sendKernelRequestFromNotebook(nbPanel, code, null);
    })});

  }
};

export default extension;