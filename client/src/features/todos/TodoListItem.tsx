import { Todo } from '../../app/services/todos';

export const TodoListItem = ({
  data: { text, id, done },
  onDone,
  onDelete,
  isDeleting,
  isUpdating,
}: {
  data: Todo;
  onDone: (id: string, done: boolean) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  isUpdating?: boolean;
}) => {
  const classes = ['todo-item'];
  done && classes.push('checked');
  (isUpdating || isDeleting) && classes.push('pending');

  return (
    <li className={classes.join(' ')}>
      <div className="todo-text">{text}</div>
      <div className="todo-buttons">
        <button
          onClick={() => onDelete(id)}
          title="Delete"
          disabled={isDeleting}
        >
          {isDeleting ? '◽◽' : '❌'}
        </button>
        {!done && (
          <button
            onClick={() => onDone(id, !done)}
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
