<script lang="ts">
  import {
    Content,
    Grid,
    Row,
    Column,
    UnorderedList,
    ListItem,
    Tabs,
    Tab,
    TabContent,
  } from "carbon-components-svelte";
</script>

<Content>
  <Grid>
    <Row>
      <Column>
        <h1>Análisis léxico</h1>
        <p>
          Esta parte comprende <strong>autómatas</strong> y todo lo que tiene que
          ver con ellos:
        </p>
      </Column>
    </Row>
    <Row>
      <Column>
        <UnorderedList expressive>
          <ListItem
            >Pasar de un autómata <strong>no determinista</strong> a uno
            <strong>determinista</strong>
          </ListItem>
          <ListItem
            ><strong>Minimizar</strong> estos autómatas deterministas</ListItem
          >
        </UnorderedList>
      </Column>
    </Row>
    <Row>
      <Column>
        
      </Column>
    </Row>
  </Grid>
</Content>
