if(typeof CONTAM == "undefined")
{
  var CONTAM = {};
}

CONTAM.ElementList = {};

CONTAM.ElementList.CreateList = function()
{
  return { start:null, 
           count:0, 
           AddNode:CONTAM.ElementList.AddNode,
           GetByNumber:CONTAM.ElementList.GetByNumber };
}

CONTAM.ElementList.AddNode = function(node)
{
  var currentNode = this.start;
  if(currentNode == undefined)
  {
    this.start = node;
    this.next = null;
    this.count++;
  }
  else if(node.name < currentNode.Name)
  {
    this.start = node;
    node.next = currentNode;
    this.count++;
  }
  else
  {
    var done = false;
    var prevNode;
    while(!done)
    {
      prevNode = currentNode;
      currentNode = prevNode.next;
      if(currentNode == undefined ||
         currentNode == null)
      {
        prevNode.next = node;
        node.next = null;
        done = true;
        this.count++;
      }
      else if(node.name < currentNode.Name)
      {
        prevNode.next = node;
        node.next = currentNode;
        done = true;
        this.count++;
      }
    }
  }
}

CONTAM.ElementList.GetByNumber = function(n)
{
  var item, i;
  if(n < 1 || n > this.count)
  {
    alert("Can't get an element with number: " + n.toString());
    return;
  }
  item = this.start;
  for(i=2; i<=n; ++i)
    item = item.next;
  return item;
}
