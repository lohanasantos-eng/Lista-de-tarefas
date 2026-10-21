const formulario = document.querySelector("#formulario");
const campo = document.querySelector("#tarefa");
const lista = document.querySelector("#lista");
const resumo = document.querySelector("#resumo");

const chave = "portfolio-lista-tarefas";

let tarefas = carregarTarefas();

function carregarTarefas() {
  try {
    const dados = JSON.parse(localStorage.getItem(chave) || "[]");

    if (!Array.isArray(dados)) {
      return [];
    }

    return dados.filter((tarefa) => {
      return (
        tarefa &&
        typeof tarefa.texto === "string" &&
        typeof tarefa.concluida === "boolean"
      );
    });
  } catch {
    return [];
  }
}

function salvarTarefas() {
  try {
    localStorage.setItem(chave, JSON.stringify(tarefas));
  } catch {
    resumo.textContent += " Não foi possível salvar neste navegador.";
  }
}

function atualizarLista() {
  lista.replaceChildren();

  tarefas.forEach((tarefa, indice) => {
    const item = document.createElement("li");

    if (tarefa.concluida) {
      item.classList.add("concluida");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarefa.concluida;
    checkbox.setAttribute(
      "aria-label",
      `Marcar como concluída: ${tarefa.texto}`
    );

    checkbox.addEventListener("change", () => {
      tarefa.concluida = checkbox.checked;

      item.classList.toggle("concluida", tarefa.concluida);

      atualizarResumo();
      salvarTarefas();
    });

    const texto = document.createElement("span");
    texto.textContent = tarefa.texto;

    const excluir = document.createElement("button");
    excluir.type = "button";
    excluir.textContent = "Excluir";
    excluir.className = "excluir";
    excluir.setAttribute("aria-label", `Excluir: ${tarefa.texto}`);

    excluir.addEventListener("click", () => {
      tarefas.splice(indice, 1);

      atualizarLista();
      salvarTarefas();
      campo.focus();
    });

    item.append(checkbox, texto, excluir);
    lista.append(item);
  });

  atualizarResumo();
}

function atualizarResumo() {
  const pendentes = tarefas.filter((tarefa) => {
    return !tarefa.concluida;
  }).length;

  resumo.textContent = tarefas.length === 0
    ? "Sua lista está vazia. Adicione uma tarefa!"
    : `${pendentes} pendente(s) de ${tarefas.length} tarefa(s).`;
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const texto = campo.value.trim();

  if (!texto) {
    campo.value = "";
    campo.focus();
    return;
  }

  tarefas.push({
    texto: texto,
    concluida: false
  });

  atualizarLista();
  salvarTarefas();

  formulario.reset();
  campo.focus();
});

atualizarLista();