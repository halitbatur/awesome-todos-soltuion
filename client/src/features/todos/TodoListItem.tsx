import { Todo } from '../../app/services/todos';

export const TodoListItem = ({
  data: { text, id, done, isLocal },
  onDone,
  onDelete,
  isDeleting,
  isUpdating,
}: {
  data: Todo;
  onDone: (id: string, done: boolean, isLocal: boolean | void) => void;
  onDelete: (id: string, isLocal: boolean | void) => void;
  isDeleting: boolean;
  isUpdating?: boolean;
}) => {
  const classes = ['todo-item'];
  done && classes.push('checked');
  (isUpdating || isDeleting) && classes.push('pending');

  return (
    <li className={classes.join(' ')}>
      <div className="todo-content">
        <div className="todo-text">{text}</div>
        <div className="todo-tags">
          {isLocal ? <div className="todo-local">local</div> : <></>}
        </div>
      </div>
      <div className="todo-buttons">
        <button
          onClick={() => onDelete(id, isLocal)}
          title="Delete"
          disabled={isDeleting}
        >
          {isDeleting ? '◽◽' : '❌'}
        </button>
        {!done && (
          <button
            onClick={() => onDone(id, !done, isLocal)}
            title={done ? 'Mark undone' : 'Mark done'}
            disabled={isUpdating}
          >
            {isUpdating ? '◽◽' : '✔️'}
          </button>
        )}
      </div>
    </li>
  );
};
