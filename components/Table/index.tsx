import Container from './Container';
import FieldRowPseudo from './FieldRow/Pseudo';

const Table = Object.assign(Container, {
  FieldRow: FieldRowPseudo,
});

export default Table;
