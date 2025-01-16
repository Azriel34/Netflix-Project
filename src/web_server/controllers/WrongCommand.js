//handle correct path but with no possible POST/GET/PATCH/DELETE
const handleWrongCommand = (req, res) => {
    res.status(400).json({ error: 'Wrong Command' });
};

//handle wrong path
const handleWrongPage = (req, res) => {
    res.status(404).json({ error: 'Page Not Found' });
};
  
module.exports = {handleWrongCommand, handleWrongPage};