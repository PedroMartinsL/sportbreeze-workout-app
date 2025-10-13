def pytest_itemcollected(item):
    """Show the test's docstring (if available) in pytest verbose output."""
    doc = item.obj.__doc__
    if doc:
        # Replace test name with docstring in the output
        item._nodeid = f"{item.nodeid} :: {doc.strip()}"
