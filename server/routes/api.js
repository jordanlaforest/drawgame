import Player from '../../common/Player';

export default function(app) {

  app.get('/api/games', function(req, res) {
    res.send([
      { name: 'Canadian peeps', players: '5/10', password: false },
      { name: 'American peeps', players: '2/4', password: true },
      { name: 'British peeps', players: '3/8', password: true }
    ]);
  });

  app.get('/api/game/:id/info', function(req, res) {
    let { id } = req.params;
    id = parseInt(id);

    let currentlyDrawing = null;
    let currentWord = null;
    let players = null;
    switch(id) {
      case 0:
        currentlyDrawing = 2;
        currentWord = 'Dog';
        players = [
          new Player({ id: 0, name: 'Bob', score: 4 }),
          new Player({ id: 1, name: 'Patrick', score: 0 }),
          new Player({ id: 2, name: 'Sandy', score: 7 }),
          new Player({ id: 3, name: 'Mary', score: 2 }),
          new Player({ id: 4, name: 'Yvonne', score: 3 })
        ];
        break;
      case 1:
        currentlyDrawing = 1;
        currentWord = 'Cat';
        players = [
          new Player({ id: 0, name: 'Fred', score: 5 }),
          new Player({ id: 1, name: 'Nick', score: 2 }),
        ];
        break;
      case 2:
        currentlyDrawing = 0;
        currentWord = 'Potato';
        players = [
          new Player({ id: 0, name: 'Jordan', score: 3 }),
          new Player({ id: 1, name: 'Eve', score: 7 }),
          new Player({ id: 2, name: 'Gary', score: 4 })
        ];
        break;
      default:
        players = [];
    }
    res.send({
      currentWord,
      currentlyDrawing,
      players
    });
  });
}
