if(typeof CONTAM == "undefined")
{
  var CONTAM = {};
}

CONTAM.ElementList = {};

CONTAM.ElementList.CreateList = function()
{
  return { start:undefined, 
           count:0, 
           AddNode:CONTAM.ElementList.AddNode,
           GetByNumber:CONTAM.ElementList.GetByNumber,
           GetByName: CONTAM.ElementList.GetByName };
}

CONTAM.ElementList.AddNode = function(node)
{
  var currentNode = this.start;
  if(currentNode == undefined)
  {
    this.start = node;
    this.next = undefined;
    this.count++;
  }
  else if(node.name < currentNode.name)
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
      if(currentNode == undefined)
      {
        prevNode.next = node;
        node.next = undefined;
        done = true;
        this.count++;
      }
      else if(node.name < currentNode.name)
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
    throw new Error('Cannot get an element with number: ' + n);
  }
  item = this.start;
  for(i=2; i<=n; ++i)
    item = item.next;
  return item;
}

CONTAM.ElementList.GetByName = function(name)
{
  var currentNode = this.start;
  if(currentNode == undefined)
    return undefined;
  var done = false;
  while(!done)
  {
    if(currentNode.name == name)
      return currentNode;
    currentNode = currentNode.next;
    if(currentNode == undefined)
      return undefined;
  }
  
}
